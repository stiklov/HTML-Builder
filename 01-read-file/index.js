const fs = require('fs');
const path = require('node:path');

const file = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(file);

stream.on('data', function(file) {
    const output = file.toString();
    console.log(output);
});