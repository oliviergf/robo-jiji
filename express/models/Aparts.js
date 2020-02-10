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
      type: Sequelize.STRING
    },

    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },

    creation_date: {
      type: Sequelize.DATE,
      defaultValue: sequelize.NOW
    },

    rooms: {
      type: Sequelize.ENUM("1", "2", "3", "4", "5", "6", "7")
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
