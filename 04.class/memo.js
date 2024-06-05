#!/usr/bin/env node

import * as readline from "node:readline/promises";
import sqlite3 from "sqlite3";
import { Command } from "commander";

// データベース操作の関数
function runWithPromise(database, sql, params = []) {
  return new Promise((resolve, reject) => {
    database.run(sql, params, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this);
      }
    });
  });
}

function getWithPromise(database, sql, params = []) {
  return new Promise((resolve, reject) => {
    database.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
}

function allWithPromise(database, sql, params = []) {
  return new Promise((resolve, reject) => {
    database.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

// 標準入力から文字列を受け取る
function createNewMemo(readLines) {
  return new Promise((resolve) => {
    const memos = [];

    readLines.on("line", (input) => {
      if (input === "exit") {
        readLines.close();
      } else {
        memos.push(input);
      }
    });

    readLines.on("close", () => {
      resolve(memos.join("\n"));
    });
  });
}

// ******プログラム本体******
// 新しいメモをデータベースに保存するまで

// データベースを開く
const database = new sqlite3.Database("./memo.sqlite3");

// オプション設定
const program = new Command();

program
  .option("-l, --list", "保存されたメモの先頭行のみを出力する")
  .option("-r, --read", "選んだメモの全行を出力する")
  .option("-d, --delete", "選んだメモを削除する")
  .parse();

// オプション管理
const options = Object.keys(program.opts());

if (options.length > 1) {
  throw new Error("複数のオプションは指定できない");
}

const option = options[0];

// 標準入力を取得の準備
const readLines = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 標準入力を文字列として受け取る
const memo = await createNewMemo(readLines);

// データベースにmemosテーブルが存在するかの確認
const memosTable = await getWithPromise(
  database,
  "SELECT name FROM sqlite_master WHERE type='table' AND name='memos';",
);

// もしmemosテーブルがない場合はmemosテーブルを作成する
if (typeof memosTable === "undefined") {
  await runWithPromise(
    database,
    "CREATE TABLE memos ( id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL )",
  );
}

// 新しいメモをデータベースに挿入する
await runWithPromise(database, "INSERT INTO memos (content) VALUES (?)", memo);
