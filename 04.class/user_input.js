import * as readline from "node:readline";
import enquirer from "enquirer";
import { handleEnquirerError, handleGeneralError } from "./handle_error.js";

export class UserInput {
  #prompt;

  constructor() {
    const { prompt } = enquirer;
    this.#prompt = prompt;
  }

  async runEnquirerOfSelect({ message, limit = 5, choices }) {
    try {
      const response = await this.#prompt({
        type: "select",
        name: "id",
        message,
        limit,
        choices,
      });

      return response.id;
    } catch (error) {
      handleEnquirerError(error);
    }
  }

  async runReadline() {
    try {
      const newMemos = await this.#acceptUserInput();
      return newMemos.join("\n");
    } catch (error) {
      handleGeneralError(error);
    }
  }

  #acceptUserInput() {
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

      rl.on("error", () => {
        reject(new Error("入力中にエラーが発生しました。"));
        rl.close();
      });
    });
  }
}
