#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { run, all } from "./common_functions.js";

const database = new sqlite3.Database(":memory:");

async function nonexistingErrorDatabase(db) {
  await run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  const result = await run(db, "INSERT INTO books (title) VALUES(?)", [
    "プロを目指す人のためのRuby入門",
  ]);
  console.log("追加したID:", result.lastID);

  const rows = await all(db, "SELECT * FROM books");
  console.log("取得したデータ：", rows);

  await run(db, "DROP TABLE books");
}

async function existingErrorDatabase(db) {
  await run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  try {
    await run(db, "INSERT INTO books (content) VALUES(?)", [
      "Rubyを知れば、Railsはもっと楽しくなる",
    ]);
  } catch (error) {
    if (error?.code === "SQLITE_ERROR") {
      console.error("発生したエラー:", error.message);
    } else {
      throw error;
    }
  }

  try {
    const rows = await all(db, "SELECT * FROM games");
    console.log("取得したデータ：", rows);
  } catch (error) {
    if (error?.code === "SQLITE_ERROR") {
      console.error("発生したエラー:", error.message);
    } else {
      throw error;
    }
  }

  await run(db, "DROP TABLE books");
}

nonexistingErrorDatabase(database).then(() => existingErrorDatabase(database));
