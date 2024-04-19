#!/usr/bin/env node

import minimist from "minimist";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja.js";
dayjs.locale(ja);

const argv = minimist(process.argv.slice(2));
const now = dayjs();
const month = Object.keys(argv).includes("m") ? argv.m - 1 : now.month();
const year = Object.keys(argv).includes("y") ? argv.y : now.year();
const targetDate = dayjs().year(year).month(month);
const startDate = targetDate.startOf("month");
const endDate = targetDate.endOf("month").date();
const startDay = targetDate.startOf("month").day();

console.log(`      ${month + 1}月 ${year}`);
console.log("日 月 火 水 木 金 土");

for (let i = 0; i < startDay; i++) {
  process.stdout.write("   ");
}

for (let i = 0; i < endDate; i++) {
  if (startDate.add(i, "d").day() === 6) {
    process.stdout.write(String(startDate.add(i, "d").date()).padStart(2, " "));
    console.log();
  } else if (startDate.add(i, "d").day() === 0) {
    process.stdout.write(String(startDate.add(i, "d").date()).padStart(2, " "));
    process.stdout.write(" ");
  } else {
    process.stdout.write(String(startDate.add(i, "d").date()).padStart(2, " "));
    process.stdout.write(" ");
  }
}

console.log();
