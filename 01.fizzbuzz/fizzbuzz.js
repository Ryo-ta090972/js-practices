for (let cnt = 1; cnt <= 20; cnt++) {
  switch (true) {
    case cnt % 3 === 0 && cnt % 5 === 0:
      console.log("FizzBuzz");
      break;
    case cnt % 3 === 0:
      console.log("Fizz");
      break;
    case cnt % 5 === 0:
      console.log("Buzz");
      break;
    default:
      console.log(cnt);
  }
}
