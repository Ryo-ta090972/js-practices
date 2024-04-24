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

let sql =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)";
let params = "";

// エラー無し
run(db, sql)
  .then(() => {
    console.log("データベース生成完了");
    sql = "INSERT INTO books(title) values(?)";
    params = ["プロを目指す人のためのRuby入門"];
    return run(db, sql, params);
  })
  .then(() => {
    console.log("データ挿入完了");
    sql = "SELECT * FROM books";
    return all(db, sql);
  })
  .then((rows) => {
    console.log("データ取得完了：", rows);
    sql = "DROP TABLE books";
    return run(db, sql);
  })
  .then(() => {
    console.log("データ削除完了");
  })
  .catch((err) => {
    console.log("エラー：", err);
  });

await timers.setTimeout(100);

// エラーあり
sql =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)";

run(db, sql)
  .then(() => {
    console.log("データベース生成完了");
    sql = "INSERT INTO books(content) values(?)";
    params = ["Rubyを知れば、Railsはもっと楽しくなる"];
    return run(db, sql, params);
  })
  .then(() => {
    console.log("データ挿入完了");
    sql = "SELECT * FROM books";
    return all(db, sql);
  })
  .then((rows) => {
    console.log("データ取得完了：", rows);
    sql = "DROP TABLE books";
    return run(db, sql);
  })
  .then(() => {
    console.log("データ削除完了");
  })
  .catch((err) => {
    console.log("エラー：", err);
  });
