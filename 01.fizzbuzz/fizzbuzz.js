#!/usr/bin/env node

function print(text){
  console.log(String(text));
}

for (let count = 1; count <= 20; count++) {
  if (count % 3 === 0 && count % 5 === 0){
    print("FizzBuzz");
  } else if (count % 3 === 0){
    print("Fizz");
  } else if (count % 5 === 0){
    print("Buzz");
  } else {
    print(count);
  }
}
