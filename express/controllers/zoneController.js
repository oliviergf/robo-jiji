const model = require("../models");
const logger = require("../utils/logger");
const log = new logger();
zoneController = {
  createZone: async (zoneInfo) => {
    //google maps doesnt add the closing point on the polygon but mysql needs it
    try {
      const firstPoint = zoneInfo.path[0];
      zoneInfo.path.push(firstPoint);

      await model.Zones.create({
        zoneId: zoneInfo.zoneId,
        UserId: zoneInfo.userId,
        polygon: {
          type: "Polygon",
          coordinates: [zoneInfo.path],
        },
        name: zoneInfo.name,
      });
    } catch (error) {
      log.err("could not save zone", error);
    }
    //todo: checker quels apparts relativement recents sont dans la nouvelle zone?
  },
  getAllZones: async (userId) => {
    //query db
    const result = await model.Zones.findAll({
      where: {
        UserId: userId,
      },
    });

    //formats result
    let userZones = [];
    result.map((zone) => {
      // removes the last element to be google formatted polygon in UI
      zone.dataValues.polygon.coordinates[0].splice(-1, 1);
      userZones.push({
        zoneId: zone.dataValues.zoneId,
        path: zone.dataValues.polygon.coordinates[0],
        name: zone.dataValues.name,
      });
    });
    return userZones;
  },
  deleteZone: async (zoneInfo) => {
    //Removes element from DB
    await model.Zones.destroy({
      where: {
        zoneId: zoneInfo.zoneId,
      },
    });
  },
};

module.exports = zoneController;
