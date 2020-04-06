module.exports = function (sequelize, Sequelize) {
  const UserApart = sequelize.define("UserApart", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "_id",
      },
    },
    apartId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Aparts",
        key: "_id",
      },
    },
  });
  return UserApart;
};
