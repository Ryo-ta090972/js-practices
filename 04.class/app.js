import { Database } from "./database.js";
import { CommandLine } from "./command_line.js";
import { MemosManager } from "./memos_manager.js";
import { UserInput } from "./user_input.js";

export class App {
  #commandLine;
  #database;
  #memosManager;
  #userInput;

  constructor() {
    this.#commandLine = new CommandLine();
    this.#database = new Database("./memo.sqlite3");
    this.#memosManager = new MemosManager(this.#database);
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
    const choices = this.#memosManager.buildChoices();

    if (this.#commandLine.options["list"]) {
      this.#handleListOption();
    } else if (this.#commandLine.options["read"]) {
      await this.#handleReadOption(choices);
    } else if (this.#commandLine.options["delete"]) {
      await this.#handleDeleteOption(choices);
    }
  }

  async #createNewMemo() {
    const newMemo = await this.#userInput.runReadline();
    await this.#memosManager.add(newMemo);
  }

  async #handleListOption() {
    const firstRows = await this.#memosManager.fetchFirstRows();
    console.log(firstRows.join("\n"));
  }

  async #handleReadOption(choices) {
    const id = await this.#userInput.runEnquirerOfSelect({
      message: "Choose a memo you want to see:",
      choices: choices,
    });

    const memo = await this.#memosManager.fetch(id);
    console.log(memo.content);
  }

  async #handleDeleteOption(choices) {
    const id = await this.#userInput.runEnquirerOfSelect({
      message: "Choose a memo you want to delete:",
      choices: choices,
    });

    await this.#memosManager.delete(id);
  }
}
