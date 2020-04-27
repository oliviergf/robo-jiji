let usingAWS = false;

module.exports = {
  development: {
    username: usingAWS ? process.env.RDS_USERNAME : process.env.DB_USER,

    password: usingAWS ? process.env.RDS_PASSWORD : process.env.DB_PASS,

    database: usingAWS ? process.env.RDS_DB_NAME : process.env.DB_NAME,

    host: usingAWS ? process.env.RDS_HOSTNAME : process.env.DB_HOST,

    dialect: "mysql",
    logging: false,
  },

  test: {
    username: "",

    password: null,

    database: "",

    host: "",

    dialect: "mysql",
  },

  production: {
    username: usingAWS ? process.env.RDS_USERNAME : process.env.DB_USER,

    password: usingAWS ? process.env.RDS_PASSWORD : process.env.DB_PASS,

    database: usingAWS ? process.env.RDS_DB_NAME : process.env.DB_NAME,

    host: usingAWS ? process.env.RDS_HOSTNAME : process.env.DB_HOST,

    dialect: "mysql",
  },
};
