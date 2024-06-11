import { Command } from "commander";

export class CommandLine {
  #program;

  constructor() {
    this.#program = this.#parseProgram();
  }

  get options() {
    return this.#program.opts();
  }

  isMultipleOptions() {
    const number = Object.keys(this.options).length;

    if (number >= 2) {
      return true;
    } else {
      return false;
    }
  }

  isOption() {
    const number = Object.keys(this.options).length;

    if (number === 0) {
      return false;
    } else {
      return true;
    }
  }

  #parseProgram() {
    return new Command()
      .option("-l, --list", "データベース内のメモの先頭行を表示する")
      .option("-r, --read", "選んだメモの全行を表示する")
      .option("-d, --delete", "選んだメモを削除する")
      .parse();
  }
}
