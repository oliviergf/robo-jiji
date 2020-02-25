const request = require("request-promise");
const cheerio = require("cheerio");
const models = require("../../models");
const moment = require("moment");

/**
 * This function queries the URL of the appartement.
 * It is responsible for downloading the relevant content to be
 * displayed to the user
 * @param {string} link
 */
const query = async link => {
  const options = {
    method: "GET",
    uri: link,
    resolveWithFullResponse: true //needed to get body
  };

  const response = await request(options);
  const $ = cheerio.load(response.body);

  //loads ups the first script in the Fesloader div. its supposed to have the URL of the pictures.
  const rawData = $("#FesLoader").children()[0].children[0].data;
  const data = JSON.parse(rawData.substring(14, rawData.length - 1));

  console.log(data);
};

query(
  "https://www.kijiji.ca/v-appartement-condo/ville-de-montreal/magnifique-loft-style-3-1-2-renove-pres-du-metro-pie-ix/1489332984"
);

module.exports = query;
