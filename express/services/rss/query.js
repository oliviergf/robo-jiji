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
      //todo: utiliser https://stackoverflow.com/questions/32920743/mysql-st-within-with-polygon ST_withn. avec un ANY ?
      const users = await models.sequelize.query("SELECT * FROM `Aparts`");
      console.log("users", users);
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
