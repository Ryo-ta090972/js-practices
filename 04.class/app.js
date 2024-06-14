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
    await this.#executeActionForOption();
  }

  async #executeActionForOption() {
    const isListOption = this.#commandLine.options["list"];
    const isReadOption = this.#commandLine.options["read"];
    const isDeleteOption = this.#commandLine.options["delete"];
    const isNotOption = !this.#commandLine.isOption();
    const choices = this.#memosManager.buildChoices();

    if (isListOption) {
      await this.#outputFirstRowsOfMemos();
    } else if (isReadOption) {
      await this.#selectAndOutputMemo(choices);
    } else if (isDeleteOption) {
      await this.#selectAndDeleteMemo(choices);
    } else if (isNotOption) {
      await this.#createNewMemo();
    }
  }

  async #outputFirstRowsOfMemos() {
    const firstRows = await this.#memosManager.fetchFirstRows();
    console.log(firstRows.join("\n"));
  }

  async #selectAndOutputMemo(choices) {
    const message = "Choose a memo you want to see:";
    const id = await this.#selectMemo(message, choices);
    const memo = await this.#memosManager.fetchMemo(id);
    console.log(memo.content);
  }

  async #selectAndDeleteMemo(choices) {
    const message = "Choose a memo you want to delete:";
    const id = await this.#selectMemo(message, choices);
    await this.#memosManager.deleteMemo(id);
  }

  async #selectMemo(message, choices) {
    return await this.#userInput.runEnquirerOfSelect({
      message: message,
      choices: choices,
    });
  }

  async #createNewMemo() {
    const newMemo = await this.#userInput.runReadline();
    await this.#memosManager.addMemo(newMemo);
  }
}
