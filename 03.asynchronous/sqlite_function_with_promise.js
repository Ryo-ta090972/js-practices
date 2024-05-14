export function runWithPromise(database, sql, params = []) {
  return new Promise((resolve, reject) => {
    database.run(sql, params, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this);
      }
    });
  });
}

export function allWitPromise(database, sql, params = []) {
  return new Promise((resolve, reject) => {
    database.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}
