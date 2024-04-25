#!/usr/bin/env node

import { resolve } from "path";
import sqlite3 from "sqlite3";
import timers from "timers/promises";

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

async function sample(db) {
  try {
    await run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
    console.log("データベース生成完了");

    await run(db, "INSERT INTO books(title) values(?)", [
      "プロを目指す人のためのRuby入門",
    ]);
    console.log("データ挿入完了");

    const rows = await all(db, "SELECT * FROM books");
    console.log("データ取得完了：", rows);

    await run(db, "DROP TABLE books");
    console.log("データ削除完了");
  } catch (error) {
    console.log("エラー：", error);
  }
}

await timers.setTimeout(100);

async function sample2(db) {
  try {
    await run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
    console.log("データベース生成完了");

    await run(db, "INSERT INTO books(content) values(?)", [
      "Rubyを知れば、Railsはもっと楽しくなる",
    ]);
    console.log("データ挿入完了");

    const rows = await all(db, "SELECT * FROM books");
    console.log("データ取得完了：", rows);

    await run(db, "DROP TABLE books");
    console.log("データ削除完了");
  } catch (error) {
    console.log("エラー：", error);
  }
}

const db = new sqlite3.Database(":memory:");

sample(db);
sample2(db);
