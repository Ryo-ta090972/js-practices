#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { run, all } from "./sqlite_function_with_promise.js";
import { handleDatabaseError } from "./handle_error.js";

const database = new sqlite3.Database(":memory:");

async function databaseWithNoExistingError(database) {
  await run(
    database,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  const inserted_content = await run(
    database,
    "INSERT INTO books (title) VALUES(?)",
    ["プロを目指す人のためのRuby入門"],
  );
  console.log("追加したID:", inserted_content.lastID);

  const rows = await all(database, "SELECT * FROM books");
  console.log("取得したデータ：", rows);

  await run(database, "DROP TABLE books");
}

async function databaseWithExistingError(database) {
  await run(
    database,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  try {
    const inserted_content = await run(
      database,
      "INSERT INTO books (content) VALUES(?)",
      ["Rubyを知れば、Railsはもっと楽しくなる"],
    );
    console.log("追加したID:", inserted_content.lastID);
  } catch (error) {
    handleDatabaseError(error);
  }

  try {
    const rows = await all(database, "SELECT * FROM games");
    console.log("取得したデータ：", rows);
  } catch (error) {
    handleDatabaseError(error);
  }

  await run(database, "DROP TABLE books");
}

databaseWithNoExistingError(database).then(() =>
  databaseWithExistingError(database),
);
