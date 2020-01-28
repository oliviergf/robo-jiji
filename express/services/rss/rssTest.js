const request = require("request");

const rssQuery = link => {
  let count = 0;

  let call = () => {
    request(link, { json: true }, (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      console.log(body);
      console.log(`call: ${count}`);
      count++;
    });
  };

  setInterval(function() {
    call();
  }, 3000);
};

module.exports = rssQuery;
