const recurrentLinkService = require("./query.js");
const links = require("./links");

const startRSSService = () => {
  //startup connection pool for sequelize?

  links.map(link => {
    recurrentLinkService(link);
    //mettre un set timeout pour que les query soient décalés?
  });
};

module.exports = startRSSService;
