#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";

const db = new sqlite3.Database(":memory:");

function createTablePromise(db, tableName, tableColumn) {
  return new Promise((resolve, reject) => {
    db.run(`CREATE TABLE ${tableName} (${tableColumn})`, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function insertColumnDataPromise(db, tableName, columnName, columnData) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO ${tableName}(${columnName}) values(?)`,
      [`${columnData}`],
      function (error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });
}

function selectTableRowsPromise(db, tableName) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, [], function (error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

function dropTablePromise(db, tableName) {
  return new Promise((resolve, reject) => {
    db.run(`DROP TABLE ${tableName}`, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

const tableName = "books";
const tableColumn =
  "id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE";

// エラー無し
createTablePromise(db, tableName, tableColumn)
  .then(() => {
    console.log("データベース生成完了");
    const tableColumn = "title";
    const columnData = "プロを目指す人のためのRuby入門";
    return insertColumnDataPromise(db, tableName, tableColumn, columnData);
  })
  .then(() => {
    console.log("データ挿入完了");
    return selectTableRowsPromise(db, tableName);
  })
  .then((rows) => {
    console.log("データ取得完了：", rows);
    return dropTablePromise(db, tableName);
  })
  .then(() => {
    console.log("データ削除完了");
  })
  .catch((err) => {
    console.log("エラー：", err);
  });

await timers.setTimeout(100);

// エラーあり
createTablePromise(db, tableName, tableColumn)
  .then(() => {
    console.log("データベース生成完了");
    const tableColumn = "content";
    const columnData = "Rubyを知れば、Railsはもっと楽しくなる";
    return insertColumnDataPromise(db, tableName, tableColumn, columnData);
  })
  .then(() => {
    console.log("データ挿入完了");
    return selectTableRowsPromise(db, tableName);
  })
  .then((rows) => {
    console.log("データ取得完了：", rows);
    return dropTablePromise(db, tableName);
  })
  .then(() => {
    console.log("データ削除完了");
  })
  .catch((err) => {
    console.log("エラー：", err);
  });
