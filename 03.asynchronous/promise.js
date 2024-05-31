#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";
import {
  createBooksTable,
  selectBooksTable,
  selectGamesTable,
  dropBooksTable,
  insertTitle,
  insertContent,
} from "./database_operation_functions.js";
import { handleDatabaseError } from "./handle_error.js";

const database = new sqlite3.Database(":memory:");

// エラー無し
createBooksTable(database)
  .then(() => insertTitle(database))
  .then((statement) => {
    console.log("追加したID:", statement.lastID);
    return selectBooksTable(database);
  })
  .then((rowsOfBooksTable) => {
    console.log("取得したデータ：", rowsOfBooksTable);
    dropBooksTable(database);
  });

await timers.setTimeout(100);

// エラーあり
createBooksTable(database)
  .then(() => insertContent(database))
  .then((statement) => {
    console.log("追加したID:", statement.lastID);
    return selectGamesTable(database);
  })
  .catch((error) => {
    handleDatabaseError(error);
    return selectGamesTable(database);
  })
  .then((rowsOfGamesTable) => {
    console.log("取得したデータ：", rowsOfGamesTable);
    dropBooksTable(database);
  })
  .catch((error) => {
    handleDatabaseError(error);
    dropBooksTable(database);
  });
