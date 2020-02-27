const request = require("request-promise");
const parser = require("fast-xml-parser");
const classifier = require("../crawler/classifier");
const models = require("../../models");
const Logger = require("../../utils/logger");
const QueryTimer = 60000 * 5; // 5minutes
const log = new Logger();
rssQuery = researchLink => {
  let count = 0;
  let lastQuery = [];

  let startService = async () => {
    try {
      //ping to RSS link
      const response = await request(researchLink);
      const fetchedAparts = parser.parse(response).rss.channel.item;

      //filters aparts in lastQuery
      const newAparts = fetchedAparts.filter(
        apart =>
          !lastQuery.includes(apart.guid) &&
          apart["g-core:price"] &&
          hasValidGeo(apart)
      );

      // assign all response items to lastQuery
      lastQuery = fetchedAparts; //todos: fucks here

      // insert new aparts in db via transaction
      const result = await insertApartsIntoDb(newAparts);

      log.zoneRequestEnded(result[1], newAparts.length, count);
      count++;
    } catch (err) {
      log.err("zone query failed", err);
    }
  };

  setInterval(function() {
    startService();
  }, QueryTimer);
  startService();
};

/**
 * Adds the new Aparts in the DB via a transaction
 */
insertApartsIntoDb = async responseAparts => {
  let apartsToCreate = [];
  let UserApartsCreated = [];
  try {
    const result = await models.sequelize.transaction(async t => {
      //only select apart that arent in DB
      apartsToCreate = await selectUniqueLinks(responseAparts);

      //if theres aparts to handle
      if (apartsToCreate.length !== 0) {
        //bulk create new aparts
        await models.Aparts.bulkCreate(apartsToCreate, { transaction: t });

        /**
         * creates a new UserAparts for every new appart that fits into a zone
         * speficied by a user.
         */
        UserApartsCreated = await models.sequelize.query(
          `INSERT INTO UserAparts (userId,apartId,createdAt,updatedAt)
          select Zones.UserId as userId, Aparts._id as appart_id, NOW(), Now()
          from Zones, Aparts
          where st_contains(Zones.polygon, Aparts.localisation) AND Aparts.link IN (${apartsToCreate.map(
            apart => `'${apart.link}'`
          )})`,
          { transaction: t }
        );
      }
      return UserApartsCreated;
    });

    sendApartsToClassifier(apartsToCreate);
    log.msg("Aparts inserted in db count :", apartsToCreate.length);
    log.msg("result", result);
    return result;
  } catch (error) {
    log.err("---Transaction Failed!", error);
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back automatically by Sequelize!
  }
};

/**
 * dispatch each appart to a classifier
 */
sendApartsToClassifier = apartsToCreate => {
  //queries to get aparts images & info
  apartsToCreate.map(apart => {
    classifier(apart.link);
  });
};

/**
 * returns an array of unique apartements that arent in DB
 */
selectUniqueLinks = async newAparts => {
  let uniqueAparts = [];
  //make sure all new Aparts aren't already in database
  await Promise.all(
    newAparts.map(async apart => {
      let count = await models.Aparts.count({
        where: {
          link: apart.link
        }
      });

      if (count === 0) {
        //formats the aparts for bulk create
        uniqueAparts.push({
          title: apart.title,
          price: apart["g-core:price"],
          description: apart.description,
          link: apart.link,
          localisation: {
            type: "Point",
            coordinates: [apart["geo:lat"], apart["geo:long"]]
          }
        });
      }
    })
  );
  return uniqueAparts;
};

hasValidGeo = apart => {
  return (
    typeof apart["geo:long"] === "number" &&
    typeof apart["geo:lat"] === "number"
  );
};

module.exports = rssQuery;
