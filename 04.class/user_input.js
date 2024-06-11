import * as readline from "node:readline";
import enquirer from "enquirer";

export class UserInput {
  #prompt;

  constructor() {
    const { prompt } = enquirer;
    this.#prompt = prompt;
  }

  async runEnquirerOfSelect({ message, limit = 3, choices }) {
    const response = await this.#prompt({
      type: "select",
      name: "id",
      message: message,
      limit: limit,
      choices: choices,
    });

    return response.id;
  }

  async runReadline() {
    const newMemos = await this.#fetchReadline();
    return newMemos.join("\n");
  }

  #fetchReadline() {
    const memos = [];
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve, reject) => {
      rl.on("line", (input) => {
        if (input === "exit") {
          rl.close();
        } else {
          memos.push(input);
        }
      });

      rl.on("close", () => {
        resolve(memos);
      });

      rl.on("error", (error) => {
        reject(error);
        rl.close();
      });
    });
  }
}
