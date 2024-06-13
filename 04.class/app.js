import { Database } from "./database.js";
import { CommandLine } from "./command_line.js";
import { MemoManager } from "./memo_manager.js";
import { MemoDetail } from "./memo_detail.js";
import { UserInput } from "./user_input.js";

export class App {
  #commandLine;
  #database;
  #memoManager;
  #userInput;

  constructor() {
    this.#commandLine = new CommandLine();
    this.#database = new Database("./memo.sqlite3");
    this.#memoManager = new MemoManager(this.#database);
    this.#userInput = new UserInput();
  }

  async run() {
    this.#commandLine.ensureSingleOption();
    await this.#database.createTableIfNotExist(
      "memos",
      "id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL",
    );
    await this.#runUserInput();
  }

  async #runUserInput() {
    if (this.#commandLine.isOption()) {
      await this.#runEnquirer();
    } else {
      await this.#createNewMemo();
    }
  }

  async #runEnquirer() {
    const memos = await this.#memoManager.fetchAll();
    const choices = this.#buildChoices(memos);

    if (this.#commandLine.options["list"]) {
      this.#handleListOption(memos);
    } else if (this.#commandLine.options["read"]) {
      await this.#handleReadOption(choices);
    } else if (this.#commandLine.options["delete"]) {
      await this.#handleDeleteOption(choices);
    }
  }

  async #createNewMemo() {
    const newMemo = await this.#userInput.runReadline();
    await this.#memoManager.add(newMemo);
  }

  #handleListOption(memos) {
    const firstRows = this.#fetchFirstRows(memos);
    console.log(firstRows.join("\n"));
  }

  async #handleReadOption(choices) {
    const id = await this.#userInput.runEnquirerOfSelect({
      message: "Choose a memo you want to see:",
      choices: choices,
    });

    const memo = await this.#memoManager.fetch(id);
    console.log(memo.content);
  }

  async #handleDeleteOption(choices) {
    const id = await this.#userInput.runEnquirerOfSelect({
      message: "Choose a memo you want to delete:",
      choices: choices,
    });

    await this.#memoManager.delete(id);
  }

  #fetchFirstRows(memos) {
    const firstRows = [];
    const memoDetails = this.#buildMemoDetails(memos);

    memoDetails.forEach((memoDetail) => {
      firstRows.push(memoDetail.firstRow);
    });

    return firstRows;
  }

  #buildChoices(memos) {
    const choices = [];
    const memoDetails = this.#buildMemoDetails(memos);

    memoDetails.forEach((memoDetail) => {
      choices.push({ name: memoDetail.id, message: memoDetail.firstRow });
    });

    return choices;
  }

  #buildMemoDetails(memos) {
    const memoDetails = [];

    memos.forEach((memo) => {
      memoDetails.push(new MemoDetail(memo.id, memo.content));
    });

    return memoDetails;
  }
}
