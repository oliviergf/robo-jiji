module.exports = function(sequelize, Sequelize) {
  var Subscription = sequelize.define("Subscription", {
    _id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    BrowserToken: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    notifyAllTheTime: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    startBlockingTime: {
      type: Sequelize.TIME,
      defaultValue: "00:00"
    },
    endBlockingTime: {
      type: Sequelize.TIME,
      defaultValue: "07:00"
    }
  });
  Subscription.associate = models => {
    Subscription.belongsTo(models.Users);
  };

  return Subscription;
};
