const fs = require('fs');
const readLine = require('readline');
const PATH = './02-write-file/text.txt';

// create an input and output interface through the console
const consoleReader = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Checks if text.txt exists in the folder.
// If it is not there, creates it.
fs.access(PATH, fs.constants.F_OK, (err) => {
  if (err) {
    fs.open(PATH, 'w', (err) => console.error(err));
  }
});

// The function opens a stream for reading a line from the console.
// Checks the entered text for the 'EXIT' keyword and, if present,
// closes reading from the console. If any other text is entered,
// it writes it to a file and calls itself again.
(function writeText() {
  consoleReader.question('Write text:', (answer) => {
    if (answer.toLowerCase() == 'exit') {
      farewellPhrase();
    } else {
      fs.appendFile(PATH, answer + '\n', (err) =>
        err ? console.error(err) : writeText()
      );
    }
  });
})();

// Listening for interruption of input execution
consoleReader.on('SIGINT', () => {
  farewellPhrase();
});

// Outputting a farewell phrase and interrupting input
function farewellPhrase() {
  console.log('\nGoodbye');
  consoleReader.close();
}
