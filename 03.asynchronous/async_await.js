#!/usr/bin/env node

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
await createBooksTable(database);

const statement = await insertTitle(database);
console.log("追加したID:", statement.lastID);

const rowsOfBooksTable = await selectBooksTable(database);
console.log("取得したデータ：", rowsOfBooksTable);

await dropBooksTable(database);

// エラーあり
await createBooksTable(database);

try {
  const statement = await insertContent(database);
  console.log("追加したID:", statement.lastID);
} catch (error) {
  handleDatabaseError(error);
}

try {
  const rowsOfGamesTable = await selectGamesTable(database);
  console.log("取得したデータ：", rowsOfGamesTable);
} catch (error) {
  handleDatabaseError(error);
}

await dropBooksTable(database);
