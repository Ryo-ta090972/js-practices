#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";

// エラー無し
const dbNoError = new sqlite3.Database(":memory:", () => {
  dbNoError.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      dbNoError.run(
        "INSERT INTO books(title) values(?)",
        ["プロを目指す人のためのRuby入門"],
        function () {
          console.log("追加したID:", this.lastID);
          dbNoError.all("SELECT * FROM books", [], (error, rows) => {
            console.log("取得したデータ:", rows);
            dbNoError.run("DROP TABLE books", () => {
              console.log("booksテーブルを削除しました。");
            });
          });
        },
      );
    },
  );
});

await timers.setTimeout(100);

// エラーあり
const dbExistError = new sqlite3.Database(":memory:", () => {
  dbExistError.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      dbExistError.run(
        "INSERT INTO books(content) values(?)",
        ["Rubyを知れば、Railsはもっと楽しくなる"],
        (error) => {
          if (error) {
            console.log("発生したエラー:", error);
          }
          dbExistError.all("SELECT * FROM games", [], (error) => {
            if (error) {
              console.log("発生したエラー:", error);
            }
            dbExistError.run("DROP TABLE books", () => {
              console.log("booksテーブルを削除しました。");
            });
          });
        },
      );
    },
  );
});
