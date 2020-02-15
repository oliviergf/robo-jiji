module.exports = function(sequelize, Sequelize) {
  var Zones = sequelize.define("Zones", {
    _id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    polygon: {
      type: Sequelize.GEOMETRY("POLYGON"),
      notEmpty: true
    },

    zoneId: {
      type: Sequelize.STRING,
      notEmpty: true
    }
  });

  //medium.com/@edtimmer/sequelize-associations-basics-bde90c0deeaa
  https: Zones.associate = models => {
    Zones.hasOne(models.Users);
  };

  return Zones;
};
