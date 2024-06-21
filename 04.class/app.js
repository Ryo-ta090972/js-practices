import { Database } from "./database.js";
import { CommandLine } from "./command_line.js";
import { MemoDatabaseManager } from "./memo_database_manager.js";
import { MemoEntity } from "./memo_entity.js";
import { UserInput } from "./user_input.js";
import { handleTypeError } from "./handle_error.js";

export class App {
  #commandLine;
  #database;
  #memosDatabaseManager;
  #userInput;

  constructor() {
    this.#commandLine = new CommandLine();
    this.#database = new Database("./memo.sqlite3");
    this.#memosDatabaseManager = new MemoDatabaseManager(this.#database);
    this.#userInput = new UserInput();
  }

  async run() {
    this.#commandLine.ensureSingleOption();
    await this.#database.createTableIfNotExist(
      "memos",
      "id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL",
    );
    this.#executeActionForOption();
  }

  async #executeActionForOption() {
    const isListOption = this.#commandLine.options.list;
    const isReadOption = this.#commandLine.options.read;
    const isDeleteOption = this.#commandLine.options.delete;
    const isNotOption = !this.#commandLine.isOption();
    const memos = await this.#memosDatabaseManager.fetchAll();

    if (isListOption) {
      this.#outputFirstRows(memos);
    } else if (isReadOption) {
      this.#selectAndOutputMemo(memos);
    } else if (isDeleteOption) {
      this.#selectAndDeleteMemo(memos);
    } else if (isNotOption) {
      this.#createNewMemo();
    }
  }

  #outputFirstRows(memos) {
    const firstRows = this.#buildFirstRows(memos);
    console.log(firstRows.join("\n"));
  }

  #buildFirstRows(memos) {
    const firstRows = [];

    memos.forEach((memo) => {
      const memoEntity = new MemoEntity(memo.id, memo.content);
      firstRows.push(memoEntity.firstRow);
    });
    return firstRows;
  }

  async #selectAndOutputMemo(memos) {
    try {
      const message = "Choose a memo you want to see:";
      const choices = this.#buildChoices(memos);
      const id = await this.#selectMemo(message, choices);
      const memo = await this.#memosDatabaseManager.fetch(id);
      console.log(memo.content);
    } catch (error) {
      handleTypeError(error);
    }
  }

  async #selectAndDeleteMemo(memos) {
    const message = "Choose a memo you want to delete:";
    const choices = this.#buildChoices(memos);
    const id = await this.#selectMemo(message, choices);
    this.#memosDatabaseManager.delete(id);
  }

  #buildChoices(memos) {
    const choices = [];

    memos.forEach((memo) => {
      const memoEntity = new MemoEntity(memo.id, memo.content);
      choices.push({ name: memoEntity.id, message: memoEntity.firstRow });
    });
    return choices;
  }

  async #selectMemo(message, choices) {
    return this.#userInput.runEnquirerOfSelect({
      message,
      choices,
    });
  }

  async #createNewMemo() {
    const newMemo = await this.#userInput.runReadline();
    this.#memosDatabaseManager.add(newMemo);
  }
}
