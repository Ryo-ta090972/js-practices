#!/usr/bin/env node

import dayjs from "dayjs";
import ja from "dayjs/locale/ja.js";
dayjs.locale(ja);

const now = dayjs();
const startDate = now.startOf("month");
const endDate = now.endOf("month").date();
const startDay = now.startOf("month").day();

console.log(String(now.month() + 1).padStart(7, " ") + "月 " + now.year());
console.log("日 月 火 水 木 金 土");

for (let i = 0; i < startDay; i++) {
  process.stdout.write("  ");
}

for (let i = 0; i < endDate; i++) {
  if (startDate.add(i, "d").day() === 6) {
    process.stdout.write(String(startDate.add(i, "d").date()).padStart(3, " "));
    console.log("");
  } else if (startDate.add(i, "d").day() === 0) {
    process.stdout.write(String(startDate.add(i, "d").date()).padStart(2, " "));
  } else {
    process.stdout.write(String(startDate.add(i, "d").date()).padStart(3, " "));
  }
}

console.log();
