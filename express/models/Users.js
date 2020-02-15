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
    }
  });

  Users.associate = models => {
    Users.belongsToMany(models.Aparts, {
      through: "UserApart",
      as: "aparts",
      foreignKey: "userId"
    });
    // https://medium.com/@edtimmer/sequelize-associations-basics-bde90c0deeaa
    Users.hasMany(models.Zones, { foreignKey: "_id" });
  };

  return Users;
};
