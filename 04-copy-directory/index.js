const fs = require('fs').promises;
const path = require('node:path');
const filesFolder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

async function copyDir() {
    await fs.mkdir(newFolder, {recursive: true});
    await clear(newFolder);
    let files = await fs.readdir(filesFolder);
    for (const file of files) {
        fs.copyFile(path.join(filesFolder, file), path.join(newFolder, file));
    }
}

async function clear(folder) {
    let files = await fs.readdir(folder);
    for (const file of files) {
        fs.unlink(path.join(folder, file));
    }
}

copyDir();