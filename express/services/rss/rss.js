//ADD links here
const links = ["https://www.kijiji.ca/rss-srp-for-rent/quebec/c30349001l9001"];
const query = require("./query.js");

//call query on every links
const rss = () => {
  links.map(link => {
    query(link);
  });
};

module.exports = rss;
