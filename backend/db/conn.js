const { createPool } = require("mysql");

// const pool = createPool({
//   host: "63.250.52.212",
//   user: "transfoc_admin",
//   password: "Transfoc@2024#",
//   database: "transfoc_db",
//   connectionLimit: 50,
// });

const pool = createPool({
  host: "63.250.52.212",
  user: "databin_transfo",
  password: "Transfoc@2024#",
  database: "databin_transfo",
  connectionLimit: 50,
});
  // const pool = createPool({
  //   host: "localhost",
  //   user: "root",
  //   password: "root",
  //   database: "transfoc_db",
  //   connectionLimit: 10,
  // });
  
   console.log("mysql Connected!!");
module.exports= pool