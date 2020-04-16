const crypto = require("crypto");
module.exports = {
  getHash: (password) => {
    let mykey = crypto.createCipher("aes-128-cbc", "onlysecretforassholes");
    let encryptedPass = mykey.update(password, "utf8", "hex");
    encryptedPass += mykey.final("hex");
    return encryptedPass;
  },
};
