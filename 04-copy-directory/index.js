const fs = require('fs');
const way = './04-copy-directory';
const dir = 'files';
const discrim = '-copy';

copyDir();

async function copyDir(WAY = way, DIR = dir, DISCRIM = discrim) {
  // Check the existence of the copied folder and the folder to
  // save the copy to the current addresses. If the copied folder
  // does not exist at the address, we will issue an error, if there
  // is no folder to save, we will create it
  await [DIR, DIR + DISCRIM].forEach(async (el) => {
    await fs.access(`${WAY}/${el}`, fs.constants.F_OK, async (err) => {
      if (err) {
        if (!el.includes(DISCRIM)) {
          console.log(err);
        } else {
          // we call the function of creating a folder for copying
          // and copy files from the main folder into it
          await makeCopy(WAY, DIR, DISCRIM);
        }
      } else {
        if (el.includes(DISCRIM)) {
          // delete the old copied folder
          await fs.promises
            .rm(`${WAY}/${el}`, { recursive: true })
            .then(() => {});
          // we call the function of creating a folder for copying
          // and copy files from the main folder into it
          await makeCopy(WAY, DIR, DISCRIM);
        }
      }
    });
  });
}

// the function of creating a folder for copying
// and copy files from the main folder into it
async function makeCopy(WAY, DIR, DISCRIM) {
  // create a folder to copys
  await fs.mkdir(`${WAY}/${DIR + DISCRIM}`, { recursive: true }, (err) =>
    console.log(err)
  );
  // copy files from copy folder to new
  await copyFilesInFolder(`${WAY}/${DIR}`, `${WAY}/${DIR + DISCRIM}`);
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
