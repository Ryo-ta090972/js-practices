import { MemoDetail } from "./memo_detail.js";

export class MemosManager {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async addMemo(memo) {
    return await this.#database.update(
      "INSERT INTO memos ( content ) VALUES ( ? )",
      memo,
    );
  }

  async fetchMemo(id) {
    return await this.#database.fetchRow(
      `SELECT content FROM memos WHERE id = ? `,
      id,
    );
  }

  async deleteMemo(id) {
    return await this.#database.update(`DELETE FROM memos WHERE id = ? `, id);
  }

  async fetchFirstRows() {
    const firstRows = [];
    const memos = await this.#fetchAllMemos();

    memos.forEach((memo) => {
      const memoDetail = new MemoDetail(memo.id, memo.content);
      firstRows.push(memoDetail.firstRow);
    });
    return firstRows;
  }

  async fetchChoices() {
    const choices = [];
    const memos = await this.#fetchAllMemos();

    memos.forEach((memo) => {
      const memoDetail = new MemoDetail(memo.id, memo.content);
      choices.push(memoDetail.choiceOfEnquirer);
    });
    return choices;
  }

  async #fetchAllMemos() {
    return await this.#database.fetchAllRows("SELECT * FROM memos");
  }
}
