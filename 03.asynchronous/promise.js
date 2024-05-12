#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { checkErrorOfSqlite } from "./check_error.js";

const database = new sqlite3.Database(":memory:");

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (checkErrorOfSqlite(error)) {
        reject(error);
      } else {
        resolve(this);
      }
    });
  });
}

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (checkErrorOfSqlite(error)) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

// エラー無し
run(
  database,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    run(database, "INSERT INTO books (title) VALUES(?)", [
      "プロを目指す人のためのRuby入門",
    ]),
  )
  .then((result) => {
    console.log("追加したID:", result.lastID);
    return all(database, "SELECT * FROM books");
  })
  .then((rows) => {
    console.log("取得したデータ：", rows);
  })
  .finally(() => {
    run(database, "DROP TABLE books");
  });

await timers.setTimeout(100);

// エラーあり
run(
  database,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    run(database, "INSERT INTO books (content) VALUES(?)", [
      "Rubyを知れば、Railsはもっと楽しくなる",
    ]),
  )
  .catch((error) => {
    console.error("発生したエラー：", error.message);
    return error;
  })
  .then((result) => {
    if (!(result instanceof Error)) console.log("追加したID:", result.lastID);
    return all(database, "SELECT * FROM games");
  })
  .catch((error) => {
    console.error("発生したエラー：", error.message);
    return error;
  })
  .then((rows) => {
    if (!(rows instanceof Error)) console.log("取得したデータ：", rows);
  })
  .finally(() => {
    run(database, "DROP TABLE books");
  });
