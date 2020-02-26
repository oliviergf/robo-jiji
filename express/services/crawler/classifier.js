const cheerio = require("cheerio");
const fs = require("fs");
const axios = require("axios");
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
    // const response = await request(options);
    const response = await axios.get(link);
    const $ = cheerio.load(response.data);
    //loads ups the first script in the Fesloader div. its supposed to have the URL of the pictures.
    const rawData = $("#FesLoader").children()[0].children[0].data;
    const data = JSON.parse(rawData.substring(14, rawData.length - 1));
    //the array that constains the photos url
    const photoGallery = data.viewItemPage.viewItemData.media;
    const attributes = data.viewItemPage.viewItemData.adAttributes;
    fetchPhotos(link, photoGallery);
    // // updateApartsInfo(attributes);
    // //todo: use data to get more info on appart? YES theres a shitton of info to get xD
  } catch (error) {
    console.log(error);
  }
};

/**
 * downloads the pictures and adds them to our file system.
 * inside of the /pictures directory.
 * the strategy is the replace all the / of the link from a .
 */
fetchPhotos = async (link2, gallery) => {
  //remove https//kijiji.ca from dir
  const dir = `../../pictures/${link2.replace(/\//g, ".")}`;

  if (!fs.existsSync(dir)) {
    console.log("mkdir!", dir);
    fs.mkdirSync(dir, { recursive: true });
  }

  gallery.map(async (photo, index) => {
    try {
      const pic = await axios({
        method: "get",
        url: photo.href,
        responseType: "stream"
      });
      console.log("trying to pipe");
      pic.data.pipe(fs.createWriteStream(dir + `/${index}.jpeg`));
    } catch (error) {
      console.log(error);
      console.log("pic failed");
    }
  });
};

// query(
//   "https://www.kijiji.ca/v-appartement-condo/ville-de-montreal/4-1-2-dans-un-duplex/1489510796"
// );

/**
 * updates apparts attributes like animals allowed or parking or whatever
 */
updateApartsInfo = attributes => {};

module.exports = query;
