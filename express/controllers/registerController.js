const model = require("../models");
const hasher = require("../utils/hasher");
registerController = {
  registerUser: async (userinfo) => {
    //check that no user has the same email provided
    let userCount = await model.Users.count({
      where: {
        email: userinfo.email,
      },
    });

    encryptedPass = hasher.getHash(userinfo.password);

    if (userCount !== 0) {
      return "emailUsed";
    } else {
      //inserts new User into db
      await model.Users.create({
        firstname: userinfo.firstname,
        lastname: userinfo.lastname,
        email: userinfo.email,
        password: encryptedPass,
        platform: userinfo.platform,
        telephone: userinfo.telephone,
      });
      return "success";
    }
  },
};

module.exports = registerController;

// User.generateSalt = function () {
//   return crypto.randomBytes(16).toString("base64");
// };
// User.encryptPassword = function (plainText, salt) {
//   return crypto
//     .createHash("RSA-SHA256")
//     .update(plainText)
//     .update(salt)
//     .digest("hex");
// };
