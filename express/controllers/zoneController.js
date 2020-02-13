const model = require("../models");

zoneController = {
  createZone: async zoneInfo => {
    let firstpoint = zoneInfo.path[0];
    //google maps doesnt add the closing point on the polygon but mysql needs it
    zoneInfo.path.push(firstpoint);

    const polygonZone = {
      type: "Polygon",
      coordinates: [zoneInfo.path]
    };
    await model.Zones.create({
      zoneId: zoneInfo.zoneId,
      UserId: zoneInfo.userId,
      polygon: polygonZone
    });
  },
  getAllZones: async userId => {
    //query db
    let result = await model.Zones.findAll({
      where: {
        UserId: userId
      }
    });

    //formats result
    //todo: decide where to delete the last point of polygon?
    let userZones = [];
    result.map(zone => {
      userZones.push({
        zoneId: zone.dataValues.zoneId,
        path: zone.dataValues.polygon.coordinates
      });
    });
    return userZones;
  }
};

module.exports = zoneController;
