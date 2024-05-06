#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { run, all } from "./promise.js";

async function sample(db) {
  await run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  const result = await run(db, "INSERT INTO books (title) values(?)", [
    "プロを目指す人のためのRuby入門",
  ]);
  console.log("追加したID:", result.lastID);

  const rows = await all(db, "SELECT * FROM books");
  console.log("取得したデータ：", rows);

  await run(db, "DROP TABLE books");
}

async function sample2(db) {
  await run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  try {
    await run(db, "INSERT INTO books (content) values(?)", [
      "Rubyを知れば、Railsはもっと楽しくなる",
    ]);
  } catch (error) {
    if (error.code === "SQLITE_ERROR") {
      console.error("発生したエラー:", error.message);
    }
  }

  try {
    const rows = await all(db, "SELECT * FROM games");
    console.log("取得したデータ：", rows);
  } catch (error) {
    if (error.code === "SQLITE_ERROR") {
      console.error("発生したエラー:", error.message);
    }
  }

  await run(db, "DROP TABLE books");
}

const db = new sqlite3.Database(":memory:");

// エラー無し
sample(db);

await timers.setTimeout(100);

// エラーあり
sample2(db);
