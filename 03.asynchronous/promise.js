#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { run, all } from "./common_functions.js";

const database = new sqlite3.Database(":memory:");

// エラー無し
run(
  database,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    run(database, "INSERT INTO books(title) VALUES(?)", [
      "プロを目指す人のためのRuby入門",
    ]),
  )
  .then((result) => {
    console.log("追加したID:", result.lastID);
    return all(database, "SELECT * FROM books");
  })
  .then((rows) => {
    console.log("取得したデータ：", rows);
    return run(database, "DROP TABLE books");
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
  })
  .then((result) => {
    console.log("追加したID:", result.lastID);
    return all(database, "SELECT * FROM games");
  })
  .catch((error) => {
    console.error("発生したエラー：", error.message);
  })
  .then((rows) => {
    console.log("取得したデータ：", rows);
    return run(database, "DROP TABLE books");
  })
  .catch((error) => {
    console.error("発生したエラー：", error.message);
  });
