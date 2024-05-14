#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { run, all } from "./sqlite_function_with_promise.js";
import { handleDatabaseError } from "./handle_error.js";

const database = new sqlite3.Database(":memory:");

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
  .then((result) => {
    console.log("追加したID:", result.lastID);
    return all(database, "SELECT * FROM books");
  })
  .catch((error) => {
    handleDatabaseError(error);
    return all(database, "SELECT * FROM games");
  })
  .then((rows) => {
    console.log("取得したデータ：", rows);
  })
  .catch((error) => {
    handleDatabaseError(error);
  })
  .finally(() => {
    run(database, "DROP TABLE books");
  });
