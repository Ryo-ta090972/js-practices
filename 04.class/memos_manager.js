import { MemoDetail } from "./memo_detail.js";

export class MemosManager {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async add(memo) {
    return await this.#database.update(
      "INSERT INTO memos ( content ) VALUES ( ? )",
      memo,
    );
  }

  async fetch(id) {
    return await this.#database.fetchRow(
      `SELECT content FROM memos WHERE id = ? `,
      id,
    );
  }

  async fetchAll() {
    return await this.#database.fetchAllRows("SELECT * FROM memos");
  }

  async delete(id) {
    return await this.#database.update(`DELETE FROM memos WHERE id = ? `, id);
  }

  async fetchFirstRows() {
    const firstRows = [];
    const memoDetails = await this.#buildMemoDetails();

    memoDetails.forEach((memoDetail) => {
      firstRows.push(memoDetail.firstRow);
    });

    return firstRows;
  }

  async buildChoices() {
    const choices = [];
    const memoDetails = await this.#buildMemoDetails();

    memoDetails.forEach((memoDetail) => {
      choices.push({ name: memoDetail.id, message: memoDetail.firstRow });
    });

    return choices;
  }

  async #buildMemoDetails() {
    const memoDetails = [];
    const memos = await this.fetchAll();

    memos.forEach((memo) => {
      memoDetails.push(new MemoDetail(memo.id, memo.content));
    });

    return memoDetails;
  }
}
