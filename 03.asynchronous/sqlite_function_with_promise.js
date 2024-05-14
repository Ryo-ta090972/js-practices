import { checkErrorOfSqlite } from "./check_error.js";

export function run(database, sql, params = []) {
  return new Promise((resolve, reject) => {
    database.run(sql, params, function (result) {
      if (checkErrorOfSqlite(result)) {
        reject(result);
      } else {
        resolve(this);
      }
    });
  });
}

export function all(database, sql, params = []) {
  return new Promise((resolve, reject) => {
    database.all(sql, params, (error, rows) => {
      if (checkErrorOfSqlite(error)) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}
