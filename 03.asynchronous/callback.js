#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";

const database = new sqlite3.Database(":memory:");

function checkErrorOfSqlite(object) {
  return object instanceof Error && object.code === "SQLITE_ERROR";
}

// エラー無し
database.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    database.run(
      "INSERT INTO books (title) VALUES(?)",
      ["プロを目指す人のためのRuby入門"],
      function () {
        console.log("追加したID:", this.lastID);
        database.all("SELECT * FROM books", (_, rows) => {
          console.log("取得したデータ:", rows);
          database.run("DROP TABLE books");
        });
      },
    );
  },
);

await timers.setTimeout(100);

// エラーあり
database.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    database.run(
      "INSERT INTO books (content) VALUES(?)",
      ["Rubyを知れば、Railsはもっと楽しくなる"],
      function (result) {
        if (checkErrorOfSqlite(result)) {
          console.error("発生したエラー:", result.message);
        } else {
          console.log("追加したID:", this.lastID);
        }
        database.all("SELECT * FROM games", (error, rows) => {
          if (checkErrorOfSqlite(error)) {
            console.error("発生したエラー:", error.message);
          } else {
            console.log("取得したデータ:", rows);
          }
          database.run("DROP TABLE books");
        });
      },
    );
  },
);
