module.exports = function(sequelize, Sequelize) {
  var Aparts = sequelize.define("Aparts", {
    _id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    localisation: {
      type: Sequelize.GEOMETRY("POINT"),
      notEmpty: true
    },

    title: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    price: {
      type: Sequelize.INTEGER
    },

    link: {
      type: Sequelize.STRING,
      unique: true
    },

    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },

    rooms: {
      type: Sequelize.STRING,
      defaultValue: null
    },

    petsAllowed: {
      type: Sequelize.STRING,
      defaultValue: null
    },

    numberBedrooms: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },

    dateAvailable: {
      type: Sequelize.DATE,
      defaultValue: null
    },

    furnished: {
      type: Sequelize.BOOLEAN,
      defaultValue: null
    },

    wheelchairAccessible: {
      type: Sequelize.BOOLEAN,
      defaultValue: null
    },

    parkingSpots: {
      type: Sequelize.INTEGER,
      defaultValue: null
    }
  });

  Aparts.associate = models => {
    Aparts.belongsToMany(models.Users, {
      through: "UserApart",
      as: "users",
      foreignKey: "apartId"
    });
  };

  return Aparts;
};
