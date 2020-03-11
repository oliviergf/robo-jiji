const moment = require("moment");

class logger {
  constructor() {}

  zoneRequestEnded(UserAparts, newApartsCreated, queryCount, insertInDb) {
    console.log(
      "time                     :",
      moment().format("MMMM Do YYYY, h:mm:ss a")
    );
    console.log("newly seen appart        :", newApartsCreated);
    console.log("inserted in db           :", insertInDb);
    console.log("UserAparts created       :", UserAparts);
    console.log("query #                  :", queryCount);
    console.log("\n\n\n\n");
  }

  err(message, err) {
    console.log(message, err);
  }

  msg(message, obj) {
    console.log(message, obj);
  }
}
module.exports = logger;
