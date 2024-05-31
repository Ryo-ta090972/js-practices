import {
  runWithPromise,
  allWithPromise,
} from "./sqlite_functions_with_promise.js";

export function createBooksTable(database) {
  return runWithPromise(
    database,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
}

export function selectBooksTable(database) {
  return allWithPromise(database, "SELECT * FROM books");
}

export function selectGamesTable(database) {
  return allWithPromise(database, "SELECT * FROM games");
}

export function insertTitle(database) {
  return runWithPromise(database, "INSERT INTO books (title) VALUES (?)", [
    "プロを目指す人のためのRuby入門",
  ]);
}

export function insertContent(database) {
  return runWithPromise(database, "INSERT INTO books (content) VALUES (?)", [
    "Rubyを知れば、Railsはもっと楽しくなる",
  ]);
}

export function dropBooksTable(database) {
  return runWithPromise(database, "DROP TABLE books");
}
