const request = require("request-promise");
const parser = require("fast-xml-parser");
const classifier = require("../crawler/classifier");
const models = require("../../models");
const { Op } = require("sequelize");
const Logger = require("../../utils/logger");
const QueryTimer = 60000 * 5; // 5minutes
const log = new Logger();
const moment = require("moment");
const pushNotification = require("../notification/pushNotification");

/**
 * Performs a full sequence of events concerning a RSS link
 */
RSSqueryService = (researchLink) => {
  let count = 0;
  let lastQueryLinks = [];

  const sendRSSRequestToKijiji = async () => {
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

      // insert new aparts in db via transaction and send notifications to users
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
      log.err(`sendRSSRequestToKijiji failed: ${researchLink}`, err);
    }
  };
  //first one
  sendRSSRequestToKijiji();
  //send a query every QueryTimer
  setInterval(function () {
    sendRSSRequestToKijiji();
  }, QueryTimer);
};

/**
 * First This func filters out the non-unique apart; some other process might have added them
 * in parallel. Then, it bulk create new Aparts in DB and only then, adds up unique UserAparts by
 * the zones defined by our users.
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
        `INSERT IGNORE INTO UserAparts (userId,apartId,createdAt,updatedAt,zoneName)
        select Zones.UserId as userId, Aparts._id as appart_id, NOW(), Now(), Zones.name
        from Zones, Aparts
        where st_contains(Zones.polygon, Aparts.localisation) AND Aparts.link IN (${ApartsToCreate.map(
          (apart) => `'${apart.link}'`
        )})`,
        { transaction: t }
      );
    }
    return {
      UserApartsCreated: UserApartsCreated,
      ApartsCreated: ApartsToCreate,
    };
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

    //process newly found apart in RSS query
    const result = await processTransaction(responseAparts);

    //result.tocreate are the new unique apartements that we inserted in db
    if (result.ApartsCreated.length !== 0) {
      //classify each apart; this methods fetch the relevant info on apart link url
      let apartsClassified = await sendApartsToClassifier(result.ApartsCreated);
      //With newly created apart, verify preferences and shoot notification
      sendNotificationsToUsers(apartsClassified);
    }

    return {
      result: result.UserApartsCreated,
      insertInDb: result.ApartsCreated.length,
    };
  } catch (error) {
    log.err("---Transaction Failed!", error);
    if (triesLeft !== 0) {
      log.o(
        `Error found! ${error.parent.code} RETRYING WITH ${triesLeft} tries left`
      );
      await sleep(Math.random() * 1000);
      insertApartsIntoDb(responseAparts, triesLeft - 1, true);
    } else {
      log.o(`Error found! ${error.parent.code} no more tries left`);
    }
  }
};

/**
 * dispatch each appart to a classifier
 */
sendApartsToClassifier = async (apartsToCreate) => {
  //queries to get aparts images & info
  let aparts = await Promise.all(
    apartsToCreate.map(async (apart) => {
      //sleeps random to introduce a bit of randomness to classifier
      await sleep(Math.random() * 30000);
      return await classifier(apart.link);
    })
  );
  return aparts;
};

/**
 * dispatch a notification for newAparts to user
 */
sendNotificationsToUsers = async (apartsClassified) => {
  const apartIds = apartsClassified.map((apt) => apt._id);

  //check if any newly added apart has a UserApart associated
  const newlyCreatedUserAparts = await models.UserApart.findAll({
    where: { apartId: { [Op.in]: apartIds } },
  });

  //builds a map of UserAparts for each User
  let UserApartMap = buildUserApartMap(newlyCreatedUserAparts);

  //filters Aparts based on User Preferences
  for (let [userId, apartIds] of UserApartMap) {
    //Find user preferences
    const User = await models.Users.findOne({
      attributes: [
        "dateAvailable",
        "priceStart",
        "priceEnd",
        "rooms",
        "furnished",
        "parkingAvailable",
        "wheelchairAccessible",
        "petsAllowed",
      ],
      where: { _id: userId },
    });
    //filters aparts
    let apartThatFitPreferences = apartIds.filter((aptId) => {
      //appart with all info
      let apart = apartsClassified.find((apt) => apt._id === aptId);
      //if any criteria is not met; filter this apart
      if (
        moment(apart.dateAvailable).isSameOrBefore(
          moment(User.dateAvailable)
        ) ||
        apart.price > User.priceEnd ||
        apart.price < User.priceStart ||
        (User.furnished && !apart.furnished) ||
        (User.parkingAvailable && !apart.parkingAvailable) ||
        (User.wheelchairAccessible && !apart.wheelchairAccessible) ||
        (User.petsAllowed && !apart.petsAllowed)
      )
        return false;
      return filterApartByRoomSize(apart.rooms, JSON.parse(User.rooms));
    });
    UserApartMap.set(userId, apartThatFitPreferences);
  }

  //push notifactions to each user
  UserApartMap.forEach((val, key) => {
    if (val.length === 0) return;
    pushNotification(key, val);
  });
};

/**
 * Builds a simple map object {"UserId": [apartsId,apartsId...]}
 */
buildUserApartMap = (newlyCreatedUserAparts) => {
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
  return UserApartMap;
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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const filterApartByRoomSize = (apartRooms, userRooms) => {
  //if aparts has no rooms setting.
  if (apartRooms === null) return false;

  let filterApart = false;
  userRooms.map((userRoom) => {
    if (
      (userRoom === "1 1/2" || userRoom === "2 2/2") &&
      (apartRooms.includes("1 ½ ou 2 ½") || apartRooms === "1")
    )
      filterApart = true;
    else if (apartRooms.includes(userRoom)) filterApart = true;
  });
  return filterApart;
};

module.exports = RSSqueryService;
