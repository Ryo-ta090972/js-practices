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

  async createTableIfNotExist(tableName, column) {
    const isNotTable = await this.#isNotTable(tableName);

    if (isNotTable) {
      await this.update(`CREATE TABLE ${tableName} ( ${column} )`);
    }
  }

  async #isNotTable(tableName) {
    const response = await this.fetchRow(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ( ? )",
      tableName,
    );

    if (typeof response === "undefined") {
      return true;
    } else {
      return false;
    }
  }
}
