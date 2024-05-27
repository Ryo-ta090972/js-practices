#!/usr/bin/env node

import sqlite3 from "sqlite3";
import {
  runWithPromise,
  allWithPromise,
} from "./sqlite_functions_with_promise.js";
import { handleDatabaseError } from "./handle_error.js";

const database = new sqlite3.Database(":memory:");

// エラー無し
await runWithPromise(
  database,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);

const statement = await runWithPromise(
  database,
  "INSERT INTO books (title) VALUES (?)",
  ["プロを目指す人のためのRuby入門"],
);
console.log("追加したID:", statement.lastID);

const rowsOfBooksTable = await allWithPromise(database, "SELECT * FROM books");
console.log("取得したデータ：", rowsOfBooksTable);

await runWithPromise(database, "DROP TABLE books");

// エラーあり
await runWithPromise(
  database,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);

try {
  const statement = await runWithPromise(
    database,
    "INSERT INTO books (content) VALUES (?)",
    ["Rubyを知れば、Railsはもっと楽しくなる"],
  );
  console.log("追加したID:", statement.lastID);
} catch (error) {
  handleDatabaseError(error);
}

try {
  const rowsOfGamesTable = await allWithPromise(
    database,
    "SELECT * FROM games",
  );
  console.log("取得したデータ：", rowsOfGamesTable);
} catch (error) {
  handleDatabaseError(error);
}

await runWithPromise(database, "DROP TABLE books");
