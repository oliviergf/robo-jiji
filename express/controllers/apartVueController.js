const model = require("../models");

module.exports = vueController = {
  findApartInfos: async (apartId) => {
    let result = await model.Aparts.findOne({ where: { _id: apartId } });
    return result.dataValues;
  },
  findApartPhotos: async (userId) => {},
};
