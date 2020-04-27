// module.exports = {
//   development: {
//     username: process.env.DB_USER,

//     password: process.env.DB_PASS,

//     database: process.env.DB_NAME,

//     host: process.env.DB_HOST,

//     dialect: "mysql",
//     logging: false,
//   },

//   test: {
//     username: "",

//     password: null,

//     database: "",

//     host: "",

//     dialect: "mysql",
//   },

//   production: {
//     username: process.env.DB_USER,

//     password: process.env.DB_PASS,

//     database: process.env.DB_NAME,

//     host: process.env.DB_HOST,

//     dialect: "mysql",
//   },
// };

module.exports = {
  development: {
    username: process.env.RDS_USERNAME,

    password: process.env.RDS_PASSWORD,

    database: process.env.RDS_DB_NAME,

    host: process.env.RDS_HOSTNAME,

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
    username: process.env.RDS_USERNAME,

    password: process.env.RDS_PASSWORD,

    database: process.env.RDS_DB_NAME,

    host: process.env.RDS_HOSTNAME,

    dialect: "mysql",
  },
};
