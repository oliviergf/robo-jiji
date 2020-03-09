module.exports = function(sequelize, Sequelize) {
  var Subscription = sequelize.define("Subscription", {
    _id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    endPoint: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    p256dh: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    auth: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    expirationTime: {
      type: Sequelize.DATE
    }
  });
  Subscription.associate = models => {
    Subscription.belongsTo(models.Users);
  };

  return Subscription;
};
