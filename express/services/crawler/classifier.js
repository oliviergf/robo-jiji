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
const classifySingleApartment = async (postLink) => {
  //reset on error
  try {
    return await classifyRequestAttempt(postLink, 3, false);
  } catch (err) {
    log.err(`FAILED TO CLASSIFY APART ${postLink} `, err);
  }
};

const classifyRequestAttempt = async (postLink, triesLeft, isARetry) => {
  //reset on error
  try {
    //the apart with all info to return
    let apartWithAllInfo = {};

    if (isARetry) log.o(`RETRYING classifying WITH ${triesLeft} TRIES LEFT`);
    const response = await axios.get(postLink);
    const $ = cheerio.load(response.data);

    //loads ups the first script in the Fesloader div. its supposed to have the URL of the pictures.
    const rawData = $("#FesLoader").children()[0].children[0].data;
    const apartInfo = JSON.parse(rawData.substring(14, rawData.length - 1));

    //elements of kijiji apart response
    const photoGallery = apartInfo.viewItemPage.viewItemData.media;
    const attributes = apartInfo.viewItemPage.viewItemData.adAttributes;

    //assumes every images has been saved
    let imageCount = 0;
    photoGallery.map((photo) => {
      if (photo.type !== "video") {
        imageCount++;
      }
    });

    //fetch every images & info on the post
    if (attributes)
      apartWithAllInfo = await updateApartsAttributes(
        attributes,
        postLink,
        imageCount
      );
    if (photoGallery) fetchPhotos(photoGallery, postLink);
    return apartWithAllInfo;

    //todo: fire up notification and await photos and attributes
  } catch (err) {
    log.err(`could not fetch appart link ${postLink} restarting `, err);
    if (triesLeft > 0) {
      await sleep(Math.random() * 1500);
      apartWithAllInfo = await classifyRequestAttempt(
        postLink,
        triesLeft - 1,
        true
      );
    }
    return apartWithAllInfo;
  }
};

/**
 * downloads the pictures and adds them to our file system.
 * inside of the /pictures directory.
 * the strategy is the replace all the / of the link from a .
 *
 * todo: drop those fucks into s3 bucket: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html
 */
fetchPhotos = async (gallery, postLink) => {
  //remove https//kijiji.ca/ from dir and turns / into .
  const shortlink = postLink.substring(22);
  const dir = `./pictures/${shortlink.replace(/\//g, ".")}`;

  //creates new directory for post
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  //query image and save to fs
  gallery.map(async (photo, index) => {
    if (photo.type !== "video") {
      try {
        const picture = await axios({
          method: "get",
          url: photo.href,
          responseType: "stream",
        });
        picture.data.pipe(fs.createWriteStream(dir + `/${index}.jpeg`));
      } catch (error) {
        log.err("gallery", gallery);
        log.err(`could not fetch img ${photo.href} in dir ${dir} \n\n\n\n\n\ `);
        if (error.errno === "ECONNRESET") log.o("econreset just fucked us");
      }
    }
  });
};

/**
 * updates apart attributes in DB like  # of rooms, animals allowed, parking
 */
updateApartsAttributes = async (info, postLink, imageCount) => {
  const Apart = await models.Aparts.findOne({
    where: { link: postLink },
  });

  Apart.photoSize = imageCount;

  info.attributes.map((att) => {
    switch (att.machineKey) {
      case "numberbedrooms":
        if (att.localeSpecificValues.fr.value && att.machineValue) {
          Apart.rooms = att.localeSpecificValues.fr.value;
        }
        break;
      case "dateavailable":
        //if null, we assume it must be available now
        if (att.machineValue) Apart.dateAvailable = moment(att.machineValue);
        break;
      case "petsallowed":
        if (att.machineValue) Apart.petsAllowed = att.machineValue === "1";
        break;
      case "furnished":
        if (att.machineValue) Apart.furnished = att.machineValue === "1";
        break;
      case "wheelchairaccessible":
        if (att.machineValue)
          Apart.wheelchairAccessible = att.machineValue === "1";
        break;
      case "numberparkingspots":
        if (att.machineValue)
          Apart.parkingSpots = att.machineValue === "Not Available" ? 0 : 1;
      default:
    }
  });

  try {
    if (Apart.dateAvailable) Apart.dateAvailable = moment();
    await Apart.save();
  } catch (error) {
    console.log(error);
    console.log(info);
    console.log(postLink);
  }
  return Apart.dataValues;
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = classifySingleApartment;
