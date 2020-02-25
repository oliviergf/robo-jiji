const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
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

  try {
    const response = await request(options);
  } catch (error) {
    console.log(error);
    console.log("it fucked");
  }
  const $ = cheerio.load(response.body);

  //loads ups the first script in the Fesloader div. its supposed to have the URL of the pictures.
  const rawData = $("#FesLoader").children()[0].children[0].data;
  const data = JSON.parse(rawData.substring(14, rawData.length - 1));

  //the array that constains the photos url
  const photoGallery = data.viewItemPage.viewItemData.media;
  const attributes = data.viewItemPage.viewItemData.adAttributes;

  fetchPhotos(link, photoGallery);
  // updateApartsInfo(attributes);
  //todo: use data to get more info on appart? YES theres a shitton of info to get xD
};

/**
 * downloads the pictures and adds them to our file system.
 * inside of the /pictures directory.
 * the strategy is the replace all the / of the link from a .
 */
fetchPhotos = async (link, gallery) => {
  //remove https//kijiji.ca from dir
  const dir = `../../pictures/${link.replace(/\//g, ".")}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  gallery.map(async (photo, index) => {
    request(photo.href).pipe(fs.createWriteStream(dir + `/${index}.jpeg`));
  });
};

/**
 * updates apparts attributes like animals allowed or parking or whatever
 */
updateApartsInfo = attributes => {};

query(
  "https://www.kijiji.ca/v-appartement-condo/ville-de-montreal/grand-4-1-2-a-louer-metro-udm-outremont/1487577053"
);

module.exports = query;
