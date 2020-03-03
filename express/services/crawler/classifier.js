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
 * @param {string} postLink
 */
const classifySingleApartment = async postLink => {
  try {
    const response = await axios.get(postLink);
    const $ = cheerio.load(response.data);

    //loads ups the first script in the Fesloader div. its supposed to have the URL of the pictures.
    const rawData = $("#FesLoader").children()[0].children[0].data;
    const apartInfo = JSON.parse(rawData.substring(14, rawData.length - 1));

    //elements of kijiji apart response
    const photoGallery = apartInfo.viewItemPage.viewItemData.media;
    const attributes = apartInfo.viewItemPage.viewItemData.adAttributes;

    //fetch every images & info on the post
    // if (photoGallery) fetchPhotos(photoGallery, postLink);
    if (attributes) updateApartsAttributes(attributes, postLink);

    //todo: fire up notification and await photos and attributes
  } catch (err) {
    log.err(`could not fetch appart link ${postLink} `, err);
  }
};

/**
 * downloads the pictures and adds them to our file system.
 * inside of the /pictures directory.
 * the strategy is the replace all the / of the link from a .
 */
fetchPhotos = async (gallery, postLink) => {
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
      // picture.data.pipe(fs.createWriteStream(dir + `/${index}.jpeg`));
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
  "https://www.kijiji.ca/v-appartement-condo/ville-de-montreal/3-1-2-meuble-golden-square-mile-universite-mcgill-et-concordia/1489789602"
);

/**
 * updates apart attributes in DB like  # of rooms, animals allowed, parking
 */
updateApartsAttributes = async (info, postLink) => {
  const Apart = await models.Aparts.findOne({
    where: { link: postLink }
  });

  console.log("appart for rooms nulls", Apart)

  info.attributes.map(att => {
    switch (att.machineKey) {
      case "numberbedrooms":
        if (att.localeSpecificValues.fr.value && att.machineValue) {
          Apart.rooms = att.localeSpecificValues.fr.value;
          Apart.numberBedrooms = att.machineValue;
        }
        break;
      case "dateavailable":
        if (att.machineValue) Apart.dateAvailable = moment(att.machineValue);
        break;
      case "petsallowed":
        if (att.machineValue) Apart.petsAllowed = att.machineValue;
        break;
      case "furnished":
        if (att.machineValue) Apart.furnished = att.machineValue === "1";
        break;
      case "wheelchairaccessible":
        if (att.machineValue)
          Apart.wheelchairAccessible = att.machineValue === "1";
        break;
      case "numberparkingspots":
        if (att.machineValue) Apart.parkingSpots = att.machineValue;
      default:
    }
  });

  try {
    await Apart.save();
  } catch (error) {
    console.log(error);
    console.log(info);
    console.log(postLink);
  }
};

module.exports = classifySingleApartment;
