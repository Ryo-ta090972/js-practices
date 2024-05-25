#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";

const database = new sqlite3.Database(":memory:");

// エラー無し
database.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    database.run(
      "INSERT INTO books (title) VALUES (?)",
      ["プロを目指す人のためのRuby入門"],
      function () {
        console.log("追加したID:", this.lastID);
        database.all("SELECT * FROM books", (_, rowsOfBooks) => {
          console.log("取得したデータ:", rowsOfBooks);
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
      "INSERT INTO books (content) VALUES (?)",
      ["Rubyを知れば、Railsはもっと楽しくなる"],
      function (error) {
        if (error) {
          console.error("発生したエラー:", error.message);
        } else {
          console.log("追加したID:", this.lastID);
        }
        database.all("SELECT * FROM games", (error, rowsOfGames) => {
          if (error) {
            console.error("発生したエラー:", error.message);
          } else {
            console.log("取得したデータ:", rowsOfGames);
          }
          database.run("DROP TABLE books");
        });
      },
    );
  },
);
