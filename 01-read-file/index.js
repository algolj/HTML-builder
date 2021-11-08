const fs = require('fs');
const PATH = './01-read-file/text.txt';

// create a stream to read the file
const stream = new fs.ReadStream(PATH, {
  encoding: 'utf-8',
});

// handle the readable event on successful reading of the file
stream.on('readable', () => {
  let data = stream.read();
  console.log(data[data.length - 1] == '\n' ? data.slice(0, -1) : data);
  stream.destroy();
});

// error handler
stream.on('error', (err) => console.error('' + err));
