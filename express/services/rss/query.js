const request = require("request-promise");
const parser = require("fast-xml-parser");
const models = require("../../models");
const moment = require("moment");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const TIMER = 60000 * 5; // 5minutes

const rssQuery = link => {
  let count = 0;
  let lastQuery = [];

  let launchRequest = async () => {
    try {
      //sends a get query to link
      const response = await request(link);
      //parse response
      const aparts = parser.parse(response).rss.channel.item;

      //filter for new items and has price listed
      const newAparts = aparts.filter(
        apart => !lastQuery.includes(apart.guid) && apart["g-core:price"]
      );

      //assign all response items to lastQuery
      aparts.map(appart => lastQuery.push(appart.guid));

      //todo: handle room size and ADD BULKCREATE BECAUSE NOW IT MUST BE SLOW AS SHIT
      //creates new aparts in DB
      await newAparts.map(async apart => {
        //inserts new appart in db
        await models.Aparts.create({
          title: apart.title,
          price: apart["g-core:price"],
          description: apart.description,
          link: apart.link,
          localisation: {
            type: "Point",
            coordinates: [apart["geo:lat"], apart["geo:long"]]
          }
        }).catch(err => {
          console.log(err.original.sqlMessage);
        });
      });
      const newApartsLinks = newAparts.map(apart => apart.link);
      console.log(newApartsLinks);

      // query for what zones are affected
      let UserAparts = [];
      try {
        UserAparts = await models.sequelize.query(
          `INSERT INTO UserAparts (userId,apartId,createdAt,updatedAt)
          select Zones.UserId as userId, Aparts._id as appart_id, NOW(), Now()
          from Zones, Aparts
          where st_contains(Zones.polygon, Aparts.localisation) AND Aparts.link IN (${newApartsLinks.map(
            link => `'${link}'` //thats to format links like 'kijiji.ca/sdfsd','kijij...',...
          )})`
        );
      } catch (err) {
        // todo: handle errors properly
        console.log("UserAparts insert query has fucked");
      }

      console.log("UserAparts count generated ", UserAparts);
      console.log("time ", moment().format("MMMM Do YYYY, h:mm:ss a"));
      console.log("new apparts count: ", newAparts.length);
      console.log("query count :", count);
      count++;
    } catch (err) {
      console.log(err);
    }
  };

  setInterval(function() {
    launchRequest();
  }, TIMER);
  launchRequest();
};

module.exports = rssQuery;
