const request = require("request");
const parser = require("fast-xml-parser");
//todo: make this work
// const mysql = require("mysql");

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "securethispassword",
//   database: "devbot"
// });

const rssQuery = link => {
  const time = new Date(Date.now());
  let count = 0;

  let call = () => {
    request(link, { json: true }, (err, res, body) => {
      if (err) {
        return console.log(err);
      }

      const jsonObj = parser.parse(body);
      const items = jsonObj.rss.channel.item;
      const timeQuery = time.getUTCDay();

      items.map(item => {
        // console.log(item.description);
        const date = item.pubDate;
        const link = item.link;
        const title = item.title;
        const lat = item["geo:lat"];
        const lng = item["geo:long"];
        const price = item["g-core:price"];
        const description = item.description;

        //sql insert
        // make geo first and then apparts?
      });

      //LOGS
      console.log("-RSS query");
      console.log(`--current time: ${timeQuery}`);
      console.log(`--count: ${count}`);
      count++;
    });
  };

  //initial call where server boots
  call();

  //should prob be changed to another process or something
  setInterval(function() {
    call();
  }, 60000);
};

module.exports = rssQuery;
