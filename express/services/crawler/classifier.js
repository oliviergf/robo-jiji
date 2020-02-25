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
  try {
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

    //the array that constains the photos url
    const photoGallery = data.viewItemPage.viewItemData.media;
    const attributes = data.viewItemPage.viewItemData.adAttributes;

    fetchPhotos(link, photoGallery);
    // updateApartsInfo(attributes);
    //todo: use data to get more info on appart? YES theres a shitton of info to get xD
  } catch (err) {
    console.log(err);
  }
};

/**
 * downloads the pictures and adds them to our file system.
 * inside of the /pictures directory.
 * the strategy is the replace all the / of the link from a .
 */
fetchPhotos = async (link, gallery) => {
  const dir = `../../pictures/${link.replace(/\//g, ".")}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  gallery.map(async (photo, index) => {
    request(photo.href).pipe(fs.createWriteStream(dir + `/${index}.jpeg`));
  });
};

/**
 * updates apparts attributes like animals allowed or parking or whatever
 */
updateApartsInfo = attributes => {};

module.exports = query;
