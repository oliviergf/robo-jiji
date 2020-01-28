const request = require("request");
const parser = require("fast-xml-parser");
const configs = require("../../sql/config");
const mysql = require("mysql");
const con = mysql.createConnection(configs);

const rssQuery = link => {
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  const time = new Date(Date.now());
  let count = 0;

  let call = () => {
    request(link, { json: true }, (err, res, body) => {
      if (err) {
        return console.log(err);
      }

      const jsonObj = parser.parse(body);
      let items = jsonObj.rss.channel.item;
      const timeQuery = time.getUTCDay();

      //to be erased once we figure out the querying bug
      items = [items[0]];

      items.map(item => {
        // console.log(item.description);
        const date = item.pubDate;
        const link = item.link;
        const title = item.title;
        const lat = item["geo:lat"];
        const lng = item["geo:long"];
        const price = item["g-core:price"];
        const description = item.description;

        // //sql insert
        // // make geo first and then apparts?
        // let stmt = `INSERT INTO Geo(lat,lng)
        //     VALUES(?,?)`;
        // let todo = [lat, lng];

        // // execute the insert statment
        // con.query(stmt, todo, (err, results, fields) => {
        //   if (err) {
        //     return console.error(err.message);
        //   }
        //   // get inserted id
        //   console.log("Todo Id:" + results.insertId);
        // });

        con.end();
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
