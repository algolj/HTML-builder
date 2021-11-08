const fs = require('fs');
const path = require('path');

const way = './05-merge-styles';
const mergingFolder = 'styles';
const fileFolder = 'project-dist';
const nameMergeFile = 'bundle';
const extens = 'css';

(function mergeStyles(
  MERGING_FOLDER = `${way}/${mergingFolder}`,
  FILE_FOLDER = `${way}/${fileFolder}`,
  FILE_NAME = nameMergeFile,
  EXTENS = extens
) {
  //We check for the existence of the folder with the files and the
  // merge file. If there is no folder with files, we give an error.
  // If there is no merge file, create it.
  // If it exists, we cleanse its contents.
  [MERGING_FOLDER, `${FILE_FOLDER}/${FILE_NAME}.${EXTENS}`].forEach((el) => {
    fs.access(el, fs.constants.F_OK, (err) => {
      if (err) {
        if (!el.includes(`${FILE_NAME}.${EXTENS}`)) {
          console.error(err);
        } else {
          // create a merging file
          fs.open(el, 'w', (err) => console.error(err));
        }
      } else {
        // if the merging file exists, clear its contents
        if (el.includes(`${FILE_NAME}.${EXTENS}`)) {
          fs.writeFile(el, '', (err) => console.error(err));
        }
      }
    });
  });

  mergingFiles(MERGING_FOLDER, `${FILE_FOLDER}/${FILE_NAME}.${EXTENS}`);
})();

// function to copy file contents from folder 'WAY'
// to merging file named 'mergFile'
// ⚠️ WARNING! ⚠️
// the function makes a deep copy. In order to copy only files
// from the root folder, comment out the check that the element is a folder
function mergingFiles(WAY, mergFile) {
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
          mergingFiles(WAY + '/' + file, mergFile);
        } else {
          // if the element is a file with the desired extension
          // will write its contents to mergFile
          if (
            stats.isFile() &&
            path.extname(file).slice(1) == mergFile.split('.').splice(-1)[0]
          ) {
            // create a stream to read the file
            const stream = new fs.ReadStream(WAY + '/' + file, {
              encoding: 'utf-8',
            });

            // handle the readable event on successful reading of the file
            stream.on('readable', () => {
              let data = stream.read();
              fs.appendFile(mergFile, data + '\n', (err) => console.error(err));
              stream.destroy();
            });
          }
        }
      });
    });
  });
}
