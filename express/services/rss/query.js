const request = require("request-promise");
const parser = require("fast-xml-parser");
const models = require("../../models");
const TIMER = 60000 * 5; // 5minutes

const rssQuery = link => {
  let count = 0;
  let lastQuery = [];

  let call = async () => {
    try {
      //sends a get query to link
      const response = await request(link);
      const aparts = parser.parse(response).rss.channel.item;

      console.log("last query: ", lastQuery);

      //filter for new items and has price listed
      const new_aparts = aparts.filter(
        apart => !lastQuery.includes(apart.guid) && apart["g-core:price"]
      );

      //assign last items to old query array
      aparts.map(appart => lastQuery.push(appart.guid));

      //todo: handle room size
      //inserts new appart in db
      new_aparts.map(apart => {
        models.Aparts.create({
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

      //query for what zones are affected

      //append new appart to user's zones

      console.log("new apparts founded: ", new_aparts.length);
      console.log("query count :", count);
      count++;
    } catch (err) {
      console.log(err);
    }
  };

  //make query every 5 seconds
  setInterval(function() {
    call();
  }, TIMER);
  //initial call where server boots
  call();
};

module.exports = rssQuery;
