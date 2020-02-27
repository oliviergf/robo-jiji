const moment = require("moment");

class logger {
  constructor() {}

  zoneRequestEnded(UserAparts, newApartsCreated, queryCount) {
    console.log("time ", moment().format("MMMM Do YYYY, h:mm:ss a"));
    console.log("UserAparts created count :", UserAparts);
    console.log("newly seen appart count : ", newApartsCreated);
    console.log("query count :", queryCount);
  }

  err(message, err) {
    console.log(message, err);
  }

  msg(message, obj) {
    console.log(message, obj);
  }
}
module.exports = logger;
