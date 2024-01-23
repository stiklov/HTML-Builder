const fs = require('fs');
const path = require('node:path');
const styles = path.join(__dirname, 'styles');
const destination = path.join(__dirname, 'project-dist');

function mergeStyles() {
    const bundle = fs.createWriteStream(path.join(destination, 'bundle.css'));
    fs.readdir(styles, {withFileTypes: true}, (err, files) => {
        if (err) console.error(err);
        for (const file of files) {
            if (file.isFile()) {
                const filePath = path.join(styles, file.name);
                const extension = filePath.split('.')[1];
                if (extension === 'css') {
                    fs.createReadStream(filePath).on('data', style => {
                        bundle.write(style);
                    });
                }
            }
        }
    });
}

mergeStyles();