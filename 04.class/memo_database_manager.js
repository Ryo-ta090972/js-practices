import {
  handleSqliteConstraintError,
  handleSqliteGeneralError,
} from "./handle_error.js";

export class MemoDatabaseManager {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async add(memo) {
    try {
      return this.#database.update(
        "INSERT INTO memos ( content ) VALUES ( ? )",
        memo,
      );
    } catch (error) {
      handleSqliteConstraintError(error);
    }
  }

  async fetch(id) {
    try {
      return this.#database.fetchRow(
        "SELECT content FROM memos WHERE id = ? ",
        id,
      );
    } catch (error) {
      handleSqliteGeneralError(error);
    }
  }

  async delete(id) {
    try {
      return this.#database.update("DELETE FROM memos WHERE id = ? ", id);
    } catch (error) {
      handleSqliteGeneralError(error);
    }
  }

  async fetchAll() {
    try {
      return this.#database.fetchAllRows("SELECT * FROM memos");
    } catch (error) {
      handleSqliteGeneralError(error);
    }
  }
}
