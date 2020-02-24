const request = require("request-promise");
const parser = require("fast-xml-parser");
const models = require("../../models");
const moment = require("moment");

const rssQuery = async link => {
  var options = {
    method: "GET",
    uri: link,
    resolveWithFullResponse: true //needed to get body
  };

  request(options)
    .then(function(response) {
      console.log(response.body);
    })
    .catch(function(err) {
      // Delete failed...
    });
};

rssQuery(
  "https://www.kijiji.ca/v-chambres-a-louer-colocataire/ville-de-montreal/plateau-chambre-a-louer/1489176051"
);

module.exports = rssQuery;
