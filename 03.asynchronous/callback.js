#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";

// エラー無し
const nonexistingErrorDatabase = new sqlite3.Database(":memory:", () => {
  nonexistingErrorDatabase.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      nonexistingErrorDatabase.run(
        "INSERT INTO books (title) values(?)",
        ["プロを目指す人のためのRuby入門"],
        function () {
          console.log("追加したID:", this.lastID);
          nonexistingErrorDatabase.all(
            "SELECT * FROM books",
            [],
            (error, rows) => {
              console.log("取得したデータ:", rows);
              nonexistingErrorDatabase.run("DROP TABLE books");
            },
          );
        },
      );
    },
  );
});

await timers.setTimeout(100);

// エラーあり
const existingErrorDatabase = new sqlite3.Database(":memory:", () => {
  existingErrorDatabase.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      existingErrorDatabase.run(
        "INSERT INTO books (content) values(?)",
        ["Rubyを知れば、Railsはもっと楽しくなる"],
        (error) => {
          if (error) {
            console.log("発生したエラー:", error.message);
          }
          existingErrorDatabase.all("SELECT * FROM games", [], (error) => {
            if (error) {
              console.log("発生したエラー:", error.message);
            }
            existingErrorDatabase.run("DROP TABLE books");
          });
        },
      );
    },
  );
});
