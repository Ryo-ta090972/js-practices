#!/usr/bin/env node

import sqlite3 from "sqlite3";
import {
  runWithPromise,
  allWithPromise,
} from "./sqlite_functions_with_promise.js";
import { handleDatabaseError } from "./handle_error.js";

const database = new sqlite3.Database(":memory:");

async function databaseWithNoExistingError(database) {
  await runWithPromise(
    database,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  const insertedBook = await runWithPromise(
    database,
    "INSERT INTO books (title) VALUES (?)",
    ["プロを目指す人のためのRuby入門"],
  );
  console.log("追加したID:", insertedBook.lastID);

  const selectedBooks = await allWithPromise(database, "SELECT * FROM books");
  console.log("取得したデータ：", selectedBooks);

  await runWithPromise(database, "DROP TABLE books");
}

async function databaseWithExistingError(database) {
  await runWithPromise(
    database,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  try {
    const insertedBook = await runWithPromise(
      database,
      "INSERT INTO books (content) VALUES (?)",
      ["Rubyを知れば、Railsはもっと楽しくなる"],
    );
    console.log("追加したID:", insertedBook.lastID);
  } catch (error) {
    handleDatabaseError(error);
  }

  try {
    const selectedGames = await allWithPromise(database, "SELECT * FROM games");
    console.log("取得したデータ：", selectedGames);
  } catch (error) {
    handleDatabaseError(error);
  }

  await runWithPromise(database, "DROP TABLE books");
}

async function main(database) {
  await databaseWithNoExistingError(database);
  await databaseWithExistingError(database);
}

main(database);
