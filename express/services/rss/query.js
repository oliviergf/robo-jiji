const request = require("request-promise");
const parser = require("fast-xml-parser");
const classifier = require("../crawler/classifier");
const models = require("../../models");
const { Op } = require("sequelize");
const Logger = require("../../utils/logger");
const QueryTimer = 60000 * 5; // 5minutes
const log = new Logger();

/**
 * Performs a full sequence of events concerning a RSS link
 */
rssQuery = (researchLink) => {
  let count = 0;
  let lastQueryLinks = [];

  let startService = async () => {
    try {
      //ping the RSS link & parse stuff
      const response = await request(researchLink);
      const fetchedAparts = parser.parse(response).rss.channel.item;

      //filters aparts in lastQuery
      const newAparts = fetchedAparts.filter(
        (apart) =>
          !lastQueryLinks.includes(apart.guid) &&
          apart["g-core:price"] &&
          hasValidGeo(apart)
      );

      // empties last query links and add new links
      lastQueryLinks = [];
      fetchedAparts.map((apart) => lastQueryLinks.push(apart.link));

      // insert new aparts in db via transaction
      if (newAparts.length > 0) {
        const result = await insertApartsIntoDb(newAparts, 3, false);
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

  setInterval(function () {
    startService();
  }, QueryTimer);
  startService();
};

/**
 * Makes transaction to DB
 */
processTransaction = (responseAparts) => {
  let ApartsToCreate = [];
  let UserApartsCreated = [];
  return models.sequelize.transaction(async (t) => {
    ApartsToCreate = await selectUniqueLinks(responseAparts);

    if (ApartsToCreate.length !== 0) {
      await models.Aparts.bulkCreate(ApartsToCreate, {
        transaction: t,
        ignoreDuplicates: true,
      });

      /**
       * creates a new UserAparts for every new appart that fits into a zone
       */
      UserApartsCreated = await models.sequelize.query(
        `INSERT INTO UserAparts (userId,apartId,createdAt,updatedAt)
        select Zones.UserId as userId, Aparts._id as appart_id, NOW(), Now()
        from Zones, Aparts
        where st_contains(Zones.polygon, Aparts.localisation) AND Aparts.link IN (${ApartsToCreate.map(
          (apart) => `'${apart.link}'`
        )})`,
        { transaction: t }
      );
    }
    return { UPcreated: UserApartsCreated, toCreate: ApartsToCreate };
  });
};

/**
 * Adds the new Aparts in the DB via a transaction
 * If the transaction fails for some reason, we should retry it after 500ms
 * max retries = 3
 */
insertApartsIntoDb = async (responseAparts, triesLeft, isARetry) => {
  try {
    if (isARetry) log.o(`RETRYING QUERY WITH ${triesLeft} TRIES LEFT`);
    const result = await processTransaction(responseAparts);
    if (result.toCreate.length !== 0) sendApartsToClassifier(result.toCreate);

    return { result: result.UPcreated, insertInDb: result.toCreate.length };
  } catch (error) {
    log.err("---Transaction Failed!", error);
    //if theres a deadlock, some
    if (error.parent.code === "ER_LOCK_DEADLOCK" && triesLeft !== 0) {
      log.o(`DEADLOCKFOUND! RETRYING WITH ${triesLeft}`);
      setTimeout(() => {
        insertApartsIntoDb(responseAparts, triesLeft - 1, true);
      }, 500);
    }
  }
};

/**
 * dispatch each appart to a classifier
 */
sendApartsToClassifier = (apartsToCreate) => {
  //queries to get aparts images & info
  apartsToCreate.map((apart) => {
    classifier(apart.link);
  });
};

/**
 * returns an array of unique apartements that arent in DB
 */
selectUniqueLinks = async (newAparts) => {
  let uniqueAparts = [];

  const newApartslinks = newAparts.map((apart) => apart.link);
  const apartsInDb = await models.Aparts.findAll({
    attributes: ["link"],
    where: { link: { [Op.in]: [newApartslinks] } },
  });

  const apartsInDbLinks = apartsInDb.map((apt) => apt.dataValues.link);
  newAparts.map((apart) => {
    if (!apartsInDbLinks.includes(apart.link)) {
      uniqueAparts.push({
        title: apart.title,
        price: apart["g-core:price"],
        description: apart.description,
        link: apart.link,
        localisation: {
          type: "Point",
          coordinates: [apart["geo:lat"], apart["geo:long"]],
        },
      });
    }
  });
  return uniqueAparts;
};

hasValidGeo = (apart) => {
  return (
    typeof apart["geo:long"] === "number" &&
    typeof apart["geo:lat"] === "number"
  );
};

module.exports = rssQuery;
