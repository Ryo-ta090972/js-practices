export class MemoManager {
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
}
