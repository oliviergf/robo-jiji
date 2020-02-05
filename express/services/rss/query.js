const request = require("request-promise");
const parser = require("fast-xml-parser");
const TIMER = 60000 * 5; // 5minutes
const rssQuery = link => {
  let count = 0;
  let lastQuery = [];

  let call = async () => {
    try {
      //make query to link
      const response = await request(link);
      let aparts = parser.parse(response).rss.channel.item;

      //select new items
      let new_aparts = aparts.filter(apart => lastQuery.includes(apart));

      //assign last items to old query array
      lastQuery = aparts;

      console.log("new_aparts", new_aparts);
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
