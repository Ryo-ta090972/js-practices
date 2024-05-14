#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";

const database = new sqlite3.Database(":memory:");

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
        if (result instanceof Error) {
          if (result.code === "SQLITE_ERROR")
            console.error("捕捉したいエラー:", result.message);
          else {
            console.error("その他のエラー", result.message);
          }
        } else {
          console.log("追加したID:", this.lastID);
        }
        database.all("SELECT * FROM games", (error, rows) => {
          if (error instanceof Error) {
            if (error.code === "SQLITE_ERROR")
              console.error("捕捉したいエラー:", error.message);
            else {
              console.error("その他のエラー", error.message);
            }
          } else {
            console.log("取得したデータ:", rows);
          }
          database.run("DROP TABLE books");
        });
      },
    );
  },
);
