import sqlite3 from "sqlite3";

export class Database {
  #connection;

  constructor(path) {
    this.#connection = new sqlite3.Database(path);
  }

  async update(sql, placeholders = []) {
    return new Promise((resolve, reject) => {
      this.#connection.run(sql, placeholders, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }

  async fetchRow(sql, placeholders = []) {
    return new Promise((resolve, reject) => {
      this.#connection.get(sql, placeholders, (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      });
    });
  }

  async fetchAllRows(sql, placeholders = []) {
    return new Promise((resolve, reject) => {
      this.#connection.all(sql, placeholders, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }
}
