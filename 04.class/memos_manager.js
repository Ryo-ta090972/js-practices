import { MemoEntity } from "./memo_entity.js";
import {
  handleSqliteConstraintError,
  handleSqliteGeneralError,
} from "./handle_error.js";

export class MemosManager {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async addMemo(memo) {
    try {
      return this.#database.update(
        "INSERT INTO memos ( content ) VALUES ( ? )",
        memo,
      );
    } catch (error) {
      handleSqliteConstraintError(error);
    }
  }

  async fetchMemo(id) {
    try {
      return this.#database.fetchRow(
        "SELECT content FROM memos WHERE id = ? ",
        id,
      );
    } catch (error) {
      handleSqliteGeneralError(error);
    }
  }

  async deleteMemo(id) {
    try {
      return this.#database.update("DELETE FROM memos WHERE id = ? ", id);
    } catch (error) {
      handleSqliteGeneralError(error);
    }
  }

  async fetchFirstRows() {
    const firstRows = [];
    const memos = await this.#fetchAllMemos();

    memos.forEach((memo) => {
      const memoDetail = new MemoEntity(memo.id, memo.content);
      firstRows.push(memoDetail.firstRow);
    });
    return firstRows;
  }

  async fetchChoices() {
    const choices = [];
    const memos = await this.#fetchAllMemos();

    memos.forEach((memo) => {
      const memoDetail = new MemoEntity(memo.id, memo.content);
      choices.push(memoDetail.choiceOfEnquirer);
    });
    return choices;
  }

  async #fetchAllMemos() {
    try {
      return this.#database.fetchAllRows("SELECT * FROM memos");
    } catch (error) {
      handleSqliteGeneralError(error);
    }
  }
}
