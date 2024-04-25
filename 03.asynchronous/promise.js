#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";

const db = new sqlite3.Database(":memory:");

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
run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    return run(db, "INSERT INTO books(title) values(?)", [
      "プロを目指す人のためのRuby入門",
    ]);
  })
  .then((result) => {
    console.log("追加したID:", result.lastID);
    return all(db, "SELECT * FROM books");
  })
  .then((rows) => {
    console.log("取得したデータ：", rows);
    return run(db, "DROP TABLE books");
  });

await timers.setTimeout(100);

// エラーあり
run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    return run(db, "INSERT INTO books(content) values(?)", [
      "Rubyを知れば、Railsはもっと楽しくなる",
    ]);
  })
  .then((result) => {
    console.log("追加したID:", result.lastID);
    return all(db, "SELECT * FROM books");
  })
  .then((rows) => {
    console.log("取得したデータ：", rows);
    return run(db, "DROP TABLE books");
  })
  .catch((error) => {
    console.log("発生したエラー：", error.message);
  });
