const fs = require('fs');
const path = require('path');
const way = './03-files-in-folder/secret-folder';

(function readerDir(WAY = way) {
  // read all the items in the folder at WAY
  fs.readdir(WAY, (err, data) => {
    // display the error that occurred
    if (err) {
      console.log(err);
      return;
    }

    data.forEach((file) => {
      fs.stat(WAY + '/' + file, (err, stats) => {
        // display the error that occurred
        if (err) {
          console.log(err);
          return;
        }

        // If it is a directory, then we display
        // information about the files in it
        if (stats.isDirectory()) {
          readerDir(WAY + '/' + file);
        } else {
          // if the element is a file, display its name,
          // extension and size
          if (stats.isFile()) {
            console.log(
              file.slice(0, -path.extname(file).length) +
                ' - ' +
                (path.extname(file) || file).slice(1) +
                ' - ' +
                stats.size / 1000 +
                'kb'
            );
          }
        }
      });
    });
  });
})();
