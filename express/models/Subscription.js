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
    }
  });
  Subscription.associate = models => {
    Subscription.belongsTo(models.Users);
  };

  return Subscription;
};
