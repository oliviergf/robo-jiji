module.exports = function(sequelize, Sequelize) {
  var Users = sequelize.define("Users", {
    _id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    firstname: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    lastname: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    telephone: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    platform: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false
    },

    last_login: {
      type: Sequelize.DATE
    },

    status: {
      type: Sequelize.ENUM("active", "inactive"),
      defaultValue: "active"
    },

    dateAvailable: {
      type: Sequelize.DATE
    },
    priceStart: {
      type: Sequelize.INTEGER
    },
    priceEnd: {
      type: Sequelize.INTEGER
    },
    rooms: {
      type: Sequelize.STRING
    },
    numberBedrooms: {
      type: Sequelize.STRING
    },
    furnished: {
      type: Sequelize.BOOLEAN
    },
    parkingAvailable: {
      type: Sequelize.BOOLEAN
    },
    wheelchairAccessible: {
      type: Sequelize.BOOLEAN
    },
    petsAllowed: {
      type: Sequelize.BOOLEAN
    }
  });

  Users.associate = models => {
    Users.belongsToMany(models.Aparts, {
      through: "UserApart",
      as: "aparts",
      foreignKey: "userId"
    });
    Users.hasMany(models.Zones);
  };

  return Users;
};
