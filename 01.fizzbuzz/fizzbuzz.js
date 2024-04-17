for (let cnt = 1; cnt <= 20; cnt++) {
  switch (true) {
    case cnt % 3 === 0 && cnt % 5 === 0:
      whitePrint('FizzBuzz');
      break;
    case cnt % 3 === 0:
      whitePrint('Fizz');
      break;
    case cnt % 5 === 0:
      whitePrint('Buzz');
      break;
    default:
      whitePrint(cnt);
  }
}

function whitePrint(text){
  console.log('\x1b[37m' + text);
}
