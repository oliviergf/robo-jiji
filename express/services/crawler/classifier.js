const cheerio = require("cheerio");
const fs = require("fs");
const axios = require("axios");
const models = require("../../models");
const logger = require("../../utils/logger");
const moment = require("moment");
const log = new logger();

/**
 * This function queries the URL of the appartement.
 * It is responsible for downloading the relevant content to be
 * displayed to the user
 * @param {string} link
 */
const classifySingleApartment = async link => {
  try {
    const response = await axios.get(link);
    const $ = cheerio.load(response.data);

    //loads ups the first script in the Fesloader div. its supposed to have the URL of the pictures.
    const rawData = $("#FesLoader").children()[0].children[0].data;
    const ApartInfo = JSON.parse(rawData.substring(14, rawData.length - 1));

    //elements of kijiji apart response
    const photoGallery = ApartInfo.viewItemPage.viewItemData.media;
    const attributes = ApartInfo.viewItemPage.viewItemData.adAttributes;

    //fetch every images on the post
    if (photoGallery) fetchPhotos(link, photoGallery);
    if (attributes) updateApartsAttributes(attributes);
  } catch (err) {
    log.err(`could not fetch appart link ${link} `, err);
  }
};

/**
 * downloads the pictures and adds them to our file system.
 * inside of the /pictures directory.
 * the strategy is the replace all the / of the link from a .
 */
fetchPhotos = async (postLink, gallery) => {
  //remove https//kijiji.ca/ from dir and turns / into .
  const shortlink = postLink.substring(22);
  const dir = `./pictures/${shortlink.replace(/\//g, ".")}`;

  //creates new directory for post
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  //query image and save to fs
  gallery.map(async (photo, index) => {
    try {
      const picture = await axios({
        method: "get",
        url: photo.href,
        responseType: "stream"
      });
      picture.data.pipe(fs.createWriteStream(dir + `/${index}.jpeg`));
    } catch (error) {
      log.err(`could not fetch img ${photo.href} `, err);
    }
  });
};

/**
 *
 * debug
 *
 */
classifySingleApartment(
  "https://www.kijiji.ca/v-appartement-condo/ville-de-montreal/7-1-2-rdc-et-s-s-dun-duplex-4ch-cour-metro-diberville/1489587759"
);

/**
 * updates apart attributes in DB like  # of rooms, animals allowed, parking
 */
updateApartsAttributes = info => {
  info.attributes.map(att => {
    if (att.machineKey === "numberbedrooms")
      console.log(att.localeSpecificValues);
  });
};

module.exports = classifySingleApartment;
