#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";
import {
  runWithPromise,
  allWithPromise,
} from "./sqlite_functions_with_promise.js";
import { handleDatabaseError } from "./handle_error.js";

const database = new sqlite3.Database(":memory:");

// エラー無し
runWithPromise(
  database,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    runWithPromise(database, "INSERT INTO books (title) VALUES (?)", [
      "プロを目指す人のためのRuby入門",
    ]),
  )
  .then((statement) => {
    console.log("追加したID:", statement.lastID);
    return allWithPromise(database, "SELECT * FROM books");
  })
  .then((rowsOfBooksTable) => {
    console.log("取得したデータ：", rowsOfBooksTable);
    runWithPromise(database, "DROP TABLE books");
  });

await timers.setTimeout(100);

// エラーあり
runWithPromise(
  database,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    runWithPromise(database, "INSERT INTO books (content) VALUES (?)", [
      "Rubyを知れば、Railsはもっと楽しくなる",
    ]),
  )
  .then((statement) => {
    console.log("追加したID:", statement.lastID);
    return allWithPromise(database, "SELECT * FROM games");
  })
  .catch((error) => {
    handleDatabaseError(error);
    return allWithPromise(database, "SELECT * FROM games");
  })
  .then((rowsOfGamesTable) => {
    console.log("取得したデータ：", rowsOfGamesTable);
    runWithPromise(database, "DROP TABLE books");
  })
  .catch((error) => {
    handleDatabaseError(error);
    runWithPromise(database, "DROP TABLE books");
  });
