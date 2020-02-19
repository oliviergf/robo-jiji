const request = require("request-promise");
const parser = require("fast-xml-parser");
const models = require("../../models");
const Sequelize = require("sequelize");
const TIMER = 60000 * 5; // 5minutes

const rssQuery = link => {
  let count = 0;
  let lastQuery = [];

  let launchRequest = async () => {
    try {
      // //sends a get query to link
      // const response = await request(link);
      // //parse response
      // const aparts = parser.parse(response).rss.channel.item;

      // //debug
      // console.log("last query: ", lastQuery);

      // //filter for new items and has price listed
      // const new_aparts = aparts.filter(
      //   apart => !lastQuery.includes(apart.guid) && apart["g-core:price"]
      // );

      // //assign all response items to lastQuery
      // aparts.map(appart => lastQuery.push(appart.guid));

      // //todo: handle room size
      // new_aparts.map(apart => {
      //   //inserts new appart in db
      //   models.Aparts.create({
      //     title: apart.title,
      //     price: apart["g-core:price"],
      //     description: apart.description,
      //     link: apart.link,
      //     localisation: {
      //       type: "Point",
      //       coordinates: [apart["geo:lat"], apart["geo:long"]]
      //     }
      //   }).catch(err => {
      //     console.log(err.original.sqlMessage);
      //   });
      // });

      //query for what zones are affected
      //todo: ques qui arrive quand ya des values qui fuck avec le insert select?
      const users = await models.sequelize.query(
        "INSERT INTO UserAparts (userId,apartId,createdAt,updatedAt) " +
          "select Zones.UserId as userId, Aparts._id as appart_id, NOW(),Now() " +
          "from Zones, Aparts " +
          "where st_contains(Zones.polygon,Aparts.localisation);"
      );
      console.log("users", users);

      const bruh = await models.sequelize.query("select * from UserAparts");
      console.log("bruh", bruh);
      console.log("table length", users[0].length);
      //append new appart to user's zones

      console.log("new apparts founded: ", new_aparts);
      console.log("new apparts count: ", new_aparts.length);
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
