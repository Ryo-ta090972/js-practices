export class MemoDetail {
  #id;
  #content;

  constructor(id, content) {
    this.#id = id;
    this.#content = content;
  }

  get id() {
    return this.#id;
  }

  get content() {
    return this.#content;
  }

  get firstRow() {
    return this.#extractFirstRow();
  }

  #extractFirstRow() {
    const indexOfFirstRow = this.#content.indexOf("\n");

    if (indexOfFirstRow >= 0) {
      return this.#content.substring(0, indexOfFirstRow);
    } else {
      return this.#content;
    }
  }
}
