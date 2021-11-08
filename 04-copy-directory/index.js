const fs = require('fs');
const way = './04-copy-directory';
const dir = 'files';
const discrim = '-copy';

(function copyDir(WAY = way, DIR = dir, DISCRIM = discrim) {
  // Check the existence of the copied folder and the folder to
  // save the copy to the current addresses. If the copied folder
  // does not exist at the address, we will issue an error, if there
  // is no folder to save, we will create it
  [DIR, DIR + DISCRIM].forEach((el) => {
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
  copyFilesInFolder(`${WAY}/${DIR}`, `${WAY}/${DIR + DISCRIM}`);
})();

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
