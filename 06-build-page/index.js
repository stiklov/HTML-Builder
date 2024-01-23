const fs = require('fs');
const path = require('node:path');
const template = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');
const styles = path.join(__dirname, 'styles');
const assets = path.join(__dirname, 'assets');
const destinationFolder = path.join(__dirname, 'project-dist');
const destinationPage = path.join(destinationFolder, 'index.html');
const destinationStyles = path.join(destinationFolder, 'style.css');
const destinationAssets = path.join(destinationFolder, 'assets');

function createFolder() {
    fs.mkdir(destinationFolder, {recursive: true}, (err) => {
        if (err) console.error(err);
    });
}

function replaceTemplates() {
    const stream = fs.createReadStream(template);
    stream.on('data', function(file) {
        let fileContent = file.toString();
        fs.readdir(components, {withFileTypes: true}, (err, files) => {
            if (err) console.error(err);
            for (const file of files) {
                if (file.isFile()) {
                    let filePath = path.join(components, file.name).replace(/\\/g, '/');
                    const name = filePath.split('/').reverse()[0].split('.')[0];
                    const extension = filePath.split('.')[1];
                    if (extension === 'html') {
                        const templateStream = fs.createReadStream(filePath);
                        templateStream.on('data', function(template) {
                            fileContent = fileContent.replaceAll(`{{${name}}}`, template);
                            fs.writeFile(destinationPage, fileContent, (err) => {
                                if (err) console.error(err);
                            });
                        });
                    }
                }
            }
        });
    });
}

function mergeStyles() {
    const styleFile = fs.createWriteStream(destinationStyles);
    fs.readdir(styles, {withFileTypes: true}, (err, files) => {
        if (err) console.error(err);
        for (const file of files) {
            if (file.isFile()) {
                const filePath = path.join(styles, file.name);
                const extension = filePath.split('.')[1];
                if (extension === 'css') {
                    fs.createReadStream(filePath).on('data', style => {
                        styleFile.write(style);
                    });
                }
            }
        }
    });
}

async function copyDir(origin, destination) {
    await fs.promises.mkdir(destination, {recursive: true});
    await clear(destination);
    let files = await fs.promises.readdir(origin, {withFileTypes: true});
    for (const file of files) {
        if (file.isFile()) {
            fs.promises.copyFile(path.join(origin, file.name), path.join(destination, file.name));
        }
        else {
            fs.promises.mkdir(path.join(destination, file.name), {recursive: true}, (err) => {
                if (err) console.error(err);
            });
            copyDir(path.join(origin, file.name), path.join(destination, file.name));
        }
    }
}

async function clear(folder) {
    let files = await fs.promises.readdir(folder, {withFileTypes: true});
    for (const file of files) {
        if (file.isFile()) {
            await fs.promises.unlink(path.join(folder, file.name));
        }
        else {
            await clear(path.join(folder, file.name));
            await fs.promises.rmdir(path.join(folder, file.name));
        }
    }
}

createFolder();
replaceTemplates();
mergeStyles();
copyDir(assets ,destinationAssets);
