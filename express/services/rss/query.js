const request = require("request-promise");
const parser = require("fast-xml-parser");
const classifier = require("../crawler/classifier");
const models = require("../../models");
const moment = require("moment");
const QueryTimer = 60000 * 5; // 5minutes

const rssQuery = link => {
  let count = 0;
  let lastQuery = [];

  let launchRequest = async () => {
    try {
      //sends a get query to link
      const response = await request(link);
      //parse response
      const fetchedAparts = parser.parse(response).rss.channel.item;

      //filter aparts in lastQuery and no price listed
      const newAparts = fetchedAparts.filter(
        apart => !lastQuery.includes(apart.guid) && apart["g-core:price"]
      );

      // assign all response items to lastQuery
      fetchedAparts.map(appart => lastQuery.push(appart.guid));

      // insert new aparts in db via transaction
      const result = await insertApartsIntoDb(newAparts);

      console.log("time ", moment().format("MMMM Do YYYY, h:mm:ss a"));
      console.log("UserAparts created count :", result[1]);
      console.log("new apparts count : ", newAparts.length);
      console.log("query count :", count);
      count++;
    } catch (err) {
      console.log(err);
    }
  };

  setInterval(function() {
    launchRequest();
  }, QueryTimer);
  launchRequest();
};

/**
 * Adds the new Aparts in the DB via a transaction
 */
insertApartsIntoDb = async responseAparts => {
  try {
    const result = await models.sequelize.transaction(async t => {
      let UserAparts = [];

      //only select apart that arent in DB
      let apartsToCreate = await selectUniqueLinks(responseAparts);

      //if theres aparts to handle
      if (apartsToCreate.length !== 0) {
        //bulk create new aparts
        await models.Aparts.bulkCreate(apartsToCreate, { transaction: t });

        /**
         * creates a new UserAparts for every new appart that fits into a zone
         * speficied by a user.
         */
        UserAparts = await models.sequelize.query(
          `INSERT INTO UserAparts (userId,apartId,createdAt,updatedAt)
            select Zones.UserId as userId, Aparts._id as appart_id, NOW(), Now()
            from Zones, Aparts
            where st_contains(Zones.polygon, Aparts.localisation) AND Aparts.link IN (${apartsToCreate.map(
              apart => `'${apart.link}'`
            )})`,
          { transaction: t }
        );
      }
      return UserAparts;
    });

    return result;
  } catch (error) {
    console.log("---Transaction Failed!");
    console.log(error);
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back automatically by Sequelize!
  }
};

/**
 * returns an array of unique apartements that arent un DB
 */
selectUniqueLinks = async newAparts => {
  let uniqueAparts = [];
  //make sure newAparts aren't already in database
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

        //fetch aparts images?
        classifier(apart.link);
      }
    })
  );
  return uniqueAparts;
};

module.exports = rssQuery;
