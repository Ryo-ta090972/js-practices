#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this);
      }
    });
  });
}

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function (error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

// エラー無し
const nonexistingErrorDatabase = new sqlite3.Database(":memory:", () => {
  run(
    nonexistingErrorDatabase,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => {
      return run(
        nonexistingErrorDatabase,
        "INSERT INTO books (title) values(?)",
        ["プロを目指す人のためのRuby入門"],
      );
    })
    .then((result) => {
      console.log("追加したID:", result.lastID);
      return all(nonexistingErrorDatabase, "SELECT * FROM books");
    })
    .then((rows) => {
      console.log("取得したデータ：", rows);
      return run(nonexistingErrorDatabase, "DROP TABLE books");
    });
});

await timers.setTimeout(100);

// エラーあり
const existingErrorDatabase = new sqlite3.Database(":memory:", () => {
  run(
    existingErrorDatabase,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => {
      return run(
        existingErrorDatabase,
        "INSERT INTO books (content) values(?)",
        ["Rubyを知れば、Railsはもっと楽しくなる"],
      );
    })
    .then((result) => {
      console.log("追加したID:", result.lastID);
      return all(existingErrorDatabase, "SELECT * FROM books");
    })
    .then((rows) => {
      console.log("取得したデータ：", rows);
      return run(existingErrorDatabase, "DROP TABLE books");
    })
    .catch((error) => {
      console.error("発生したエラー：", error.message);
    });
});
