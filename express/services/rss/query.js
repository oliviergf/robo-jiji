const request = require("request-promise");
const parser = require("fast-xml-parser");
const rssQuery = link => {
  let count = 0;
  let lastQuery = [];

  let call = async () => {
    try {
      //make query to link
      const response = await request(link);
      let aparts = parser.parse(response).rss.channel.item;

      //select new items
      new_aparts = aparts.filter(apart => lastQuery.includes(apart));

      //assign last items to old query array
      lastQuery = aparts;

      console.log(new_aparts);
    } catch (err) {
      console.log(err);
    }
  };

  //make query every 5 seconds
  setInterval(function() {
    call();
  }, 5000);
  //initial call where server boots
  call();
};

module.exports = rssQuery;
