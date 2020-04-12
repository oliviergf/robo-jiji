const request = require("request-promise");
const parser = require("fast-xml-parser");
const classifier = require("../crawler/classifier");
const models = require("../../models");
const { Op } = require("sequelize");
const Logger = require("../../utils/logger");
const QueryTimer = 60000 * 5; // 5minutes
const log = new Logger();
const pushNotification = require("../notification/pushNotification");

/**
 * Performs a full sequence of events concerning a RSS link
 */
rssQuery = (researchLink) => {
  let count = 0;
  let lastQueryLinks = [];

  let startService = async () => {
    try {
      // ping the RSS link & parse stuff
      const response = await request(researchLink);
      const fetchedAparts = parser.parse(response).rss.channel.item;

      // filters aparts in lastQuery
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
        `INSERT INTO UserAparts (userId,apartId,createdAt,updatedAt,zoneName)
        select Zones.UserId as userId, Aparts._id as appart_id, NOW(), Now(), Zones.name
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
    if (result.toCreate.length !== 0) {
      sendApartsToClassifier(result.toCreate); //put random here and retries and new folder if too big
      sendNotificationsToUsers(result.toCreate);
    }

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
    setTimeout(() => {
      classifier(apart.link);
    }, Math.floor(Math.random() * 30000));
  });
};

/**
 * dispatch a notification for each new appart
 */
sendNotificationsToUsers = async (newlyCreatedAparts) => {
  //we want to get the UserAparts for the aparts who are links. ne weed apart ID tho but we only have links

  /*
    we need to get the id of the aparts, we have links above does not work under cause UserApart onlyu has id
  */
  const links = newlyCreatedAparts.map((apt) => apt.link);

  const Aparts = await models.Aparts.findAll({
    attributes: ["_id", "link"],
    where: { link: { [Op.in]: [links] } },
  });

  const apartIds = Aparts.map((apt) => apt.dataValues._id);
  const newlyCreatedUserAparts = await models.UserApart.findAll({
    where: { apartId: { [Op.in]: apartIds } },
  });

  console.log(
    "NOTIFICATIONS: new UserAparts count",
    newlyCreatedUserAparts.length
  );

  let UserApartMap = new Map();

  newlyCreatedUserAparts.map((usrApt) => {
    if (!UserApartMap.has(usrApt.dataValues.userId)) {
      UserApartMap.set(usrApt.dataValues.userId, [usrApt.dataValues.apartId]);
    } else {
      let mapUserAparts = UserApartMap.get(usrApt.dataValues.userId);
      mapUserAparts.push(usrApt.dataValues.apartId);
      UserApartMap.set(usrApt.dataValues.userId, mapUserAparts);
    }
  });

  //push notifactions to each user
  UserApartMap.forEach((val, key) => {
    pushNotification(key, val);
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
