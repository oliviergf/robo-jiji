const request = require("request");
const parser = require("fast-xml-parser");

const rssQuery = link => {
  let count = 0;

  let call = () => {
    request(link, { json: true }, (err, res, body) => {
      if (err) {
        return console.log(err);
      }

      var jsonObj = parser.parse(body);
      console.log(jsonObj);
      let items = jsonObj.rss.channel.item;

      items.map(item => {
        // console.log(item.description);
        const date = item.dc;
        const link = item.link;
        const title = item.title;
        // const lat = item.geo.lat;
        // const lng = item.geo.long;

        console.log(lat);
        console.log(lng);
      });

      // console.log(body);
      console.log(`call: ${count}`);
      count++;
    });
  };

  setInterval(function() {
    call();
  }, 3000);
};

module.exports = rssQuery;
