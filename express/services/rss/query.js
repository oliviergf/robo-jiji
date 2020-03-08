const request = require("request-promise");
const parser = require("fast-xml-parser");
const classifier = require("../crawler/classifier");
const models = require("../../models");
const { Op } = require("sequelize");
const Logger = require("../../utils/logger");
const QueryTimer = 60000 * 5; // 5minutes
const log = new Logger();

rssQuery = researchLink => {
  let count = 0;
  let lastQueryLinks = [];

  let startService = async () => {
    try {
      //ping to RSS link
      const response = await request(researchLink);
      const fetchedAparts = parser.parse(response).rss.channel.item;

      //filters aparts in lastQuery
      const newAparts = fetchedAparts.filter(
        apart =>
          !lastQueryLinks.includes(apart.guid) &&
          apart["g-core:price"] &&
          hasValidGeo(apart)
      );

      // empties last query links and add new links
      lastQueryLinks = [];
      fetchedAparts.map(apart => lastQueryLinks.push(apart.link));

      // insert new aparts in db via transaction
      if (newAparts.length > 0) {
        const result = await insertApartsIntoDb(newAparts);
        log.zoneRequestEnded(
          result.result[1] ? result.result[1] : 0,
          newAparts.length,
          count,
          result.insertInDb
        );
      } else {
        log.msg("no new aparts to handle");
      }
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
 * too much waiting in the transaction; pullout aparts.
 */
insertApartsIntoDb = async responseAparts => {
  let apartsToCreate = [];
  let UserApartsCreated = [];
  try {
    const result = await models.sequelize.transaction(async t => {
      apartsToCreate = await selectUniqueLinks(responseAparts);

      if (apartsToCreate.length !== 0) {
        await models.Aparts.bulkCreate(apartsToCreate, {
          transaction: t,
          ignoreDuplicates: true
        });

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

    if (apartsToCreate.length !== 0) sendApartsToClassifier(apartsToCreate);
    return { result: result, insertInDb: apartsToCreate.length };
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

  const newApartslinks = newAparts.map(apart => apart.link);
  const apartsInDb = await models.Aparts.findAll({
    attributes: ["link"],
    where: { link: { [Op.in]: [newApartslinks] } }
  });

  const apartsInDbLinks = apartsInDb.map(apt => apt.dataValues.link);
  newAparts.map(apart => {
    if (!apartsInDbLinks.includes(apart.link)) {
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
  });
  return uniqueAparts;
};

hasValidGeo = apart => {
  return (
    typeof apart["geo:long"] === "number" &&
    typeof apart["geo:lat"] === "number"
  );
};

module.exports = rssQuery;
