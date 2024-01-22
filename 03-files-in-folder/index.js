const fs = require('fs');
const path = require('node:path');
const folder = path.join(__dirname, 'secret-folder');

fs.readdir(folder, {withFileTypes: true}, (err, files) => {
    if (err) console.error(err);
    for (const file of files) {
        if (file.isFile()) {
            const filePath = path.join(folder, file.name);
            const name = filePath.split('/').reverse()[0].split('.')[0];
            const extension = filePath.split('.')[1];
            if (extension === 'DS_Store') continue;
            fs.stat(filePath, (err, stats) => {
                if (err) console.error(err);
                console.log(name + ' - ' + extension + ' - ' + stats.size + ' bytes');
            });
        }
    }
});