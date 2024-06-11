#!/usr/bin/env node

import * as readline from "node:readline/promises";
import { Command } from "commander";
import { Database } from "./database.js";

const tableName = "memos";
const tableSchema =
  "id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL";

// 標準入力から文字列を受け取る
function createNewMemo(readLineInterface) {
  return new Promise((resolve) => {
    const memos = [];

    readLineInterface.on("line", (input) => {
      if (input === "exit") {
        readLineInterface.close();
      } else {
        memos.push(input);
      }
    });

    readLineInterface.on("close", () => {
      resolve(memos.join("\n"));
    });
  });
}

// ******プログラム本体******
// 新しいメモをデータベースに保存するまで

// データベースを開く
const database = new Database("./memo.sqlite3");

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

// 標準入力を取得の準備
const readLineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 標準入力を文字列として受け取る
const memo = await createNewMemo(readLineInterface);

// オプションがない場合、データベースに新しいメモを保存する
await database.createTable(tableName, tableSchema);
await database.insertRow(tableName, "content", memo);
