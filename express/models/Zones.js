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
    },

    name: {
      type: Sequelize.STRING,
      notEmpty: true
    }
  });

  Zones.associate = models => {
    Zones.belongsTo(models.Users);
  };

  return Zones;
};
