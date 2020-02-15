const model = require("../models");

zoneController = {
  createZone: async zoneInfo => {
    //google maps doesnt add the closing point on the polygon but mysql needs it
    const firstPoint = zoneInfo.path[0];
    zoneInfo.path.push(firstPoint);

    console.log(zoneInfo);

    await model.Zones.create({
      zoneId: zoneInfo.zoneId,
      UserId: zoneInfo.userId,
      polygon: {
        type: "Polygon",
        coordinates: [zoneInfo.path]
      }
    });
  },
  getAllZones: async userId => {
    //query db
    const result = await model.Zones.findAll({
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
