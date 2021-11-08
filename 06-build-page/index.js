const fs = require('fs');
const path = require('path');

const way = './06-build-page';
const dir = 'project-dist';
const discrim = '';

const mergingFolder = 'styles';
const nameMergeFile = 'style';

const htmlFileName = 'index';
const mainHTMLFileName = 'template';
const buildHTMLFolder = 'components';

(function buildPage(
  WAY = way,
  DIR = dir,
  assets = 'assets',
  STYLE_FOLDER = mergingFolder,
  STYLE_FILE_NAME = nameMergeFile,
  HTML_FILE_NAME = htmlFileName,
  MAIN_HTML_FILE = mainHTMLFileName,
  COMPONENTS_HTML_FOLDER = buildHTMLFolder
) {
  // check if the build folder exists, if it does not exist - create it
  fs.access(`${WAY}/${DIR}`, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdir(`${WAY}/${DIR}`, { recursive: true }, (err) => console.log(err));
      fs.mkdir(`${WAY}/${DIR}/${assets}`, { recursive: true }, (err) =>
        console.log(err)
      );
    }
  });

  // copy the assets folder
  copyDir(WAY, assets, DIR + '/' + assets);

  // merge all files with styles into one file
  mergeStyles(
    WAY + '/' + STYLE_FOLDER,
    WAY + '/' + DIR,
    STYLE_FILE_NAME,
    'css'
  );

  // create html file
  fs.access(
    `${WAY}/${DIR}/${HTML_FILE_NAME}.html`,
    fs.constants.F_OK,
    (err) => {
      if (err) {
        fs.open(`${WAY}/${DIR}/${HTML_FILE_NAME}.html`, 'w', (err) =>
          console.error(err)
        );
      } else {
        fs.writeFile(`${WAY}/${DIR}/${HTML_FILE_NAME}.html`, '', (err) =>
          console.error(err)
        );
      }
    }
  );

  let htmlText = '';

  // create a stream to read the html main file
  const stream = new fs.ReadStream(WAY + '/' + MAIN_HTML_FILE + '.html', {
    encoding: 'utf-8',
  });

  // handle the readable event on successful reading of the main file
  stream.on('readable', () => {
    htmlText = stream.read();
    let htmlcomponent = htmlText.match(/\{([^{}]*)/g).reduce((acc, el) => {
      if (el.length > 1) acc.push(el.slice(1));
      return acc;
    }, []);
    fs.writeFile(`${WAY}/${DIR}/${HTML_FILE_NAME}.html`, htmlText, (err) =>
      console.error(err)
    );
    // add components to the main html document
    htmlcomponent.forEach((el) => {
      const stream = new fs.ReadStream(
        WAY + '/' + COMPONENTS_HTML_FOLDER + '/' + el + '.html',
        {
          encoding: 'utf-8',
        }
      );
      stream.on('readable', () => {
        htmlText = htmlText.replace(`{{${el}}}`, stream.read());
        fs.writeFile(`${WAY}/${DIR}/${HTML_FILE_NAME}.html`, htmlText, (err) =>
          console.error(err)
        );
      });
    });
    stream.destroy();
  });

  // error handler
  stream.on('error', (err) => console.error('' + err));
})();

function copyDir(WAY = way, DIR = dir, DISCRIM = discrim) {
  // Check the existence of the copied folder and the folder to
  // save the copy to the current addresses. If the copied folder
  // does not exist at the address, we will issue an error, if there
  // is no folder to save, we will create it
  [DIR, DISCRIM].forEach((el) => {
    fs.access(`${WAY}/${el}`, fs.constants.F_OK, (err) => {
      if (err) {
        if (!el.includes(DISCRIM)) {
          console.log(err);
        } else {
          // create a folder to copys
          fs.mkdir(`${WAY}/${el}`, { recursive: true }, (err) =>
            console.log(err)
          );
        }
      }
    });
  });

  // copy files from copy folder to new
  copyFilesInFolder(`${WAY}/${DIR}`, `${WAY}/${DISCRIM}`);
}

// function to copy files from a folder at 'copied Folder'
// to a folder at 'newFolder'
// ⚠️ WARNING! ⚠️
// the function makes a deep copy. In order to copy only files
// from the root folder, comment out the check that the element is a folder
function copyFilesInFolder(copiedFolder, newFolder) {
  // read all the items in the folder at copiedFolder
  fs.readdir(copiedFolder, (err, data) => {
    // display the error that occurred
    if (err) {
      console.log(err);
      return;
    }

    data.forEach((file) => {
      fs.stat(copiedFolder + '/' + file, (err, stats) => {
        // display the error that occurred
        if (err) {
          console.log(err);
          return;
        }

        // if the element is a folder, it creates a folder
        // of the same name in a new directory and then calls
        // the same function again, but with the current folder address
        if (stats.isDirectory()) {
          fs.mkdir(newFolder + '/' + file, { recursive: true }, (err) =>
            console.log(err)
          );
          copyFilesInFolder(copiedFolder + '/' + file, newFolder + '/' + file);
        } else {
          // if the item is a file, copies it to a new directory
          if (stats.isFile()) {
            fs.copyFile(
              copiedFolder + '/' + file,
              newFolder + '/' + file,
              (err) => {
                console.log(err);
                return;
              }
            );
          }
        }
      });
    });
  });
}

function mergeStyles(MERGING_FOLDER, FILE_FOLDER, FILE_NAME, EXTENS) {
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
}

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
