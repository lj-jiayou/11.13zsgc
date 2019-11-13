const connection = require("./index");

module.exports = (sql, params = []) => {
  return new Promise((reslove, reject) => {
    connection.query(sql, params, (error, data) => {
      if (error) {
        reject({ msg: "error", error });
      } else {
        reslove({ msg: "success", data });
      }
    });
  });
};
