const fs = require('fs');
const path = require('node:path');
const file = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(file);
 
process.stdout.write('Hi! Write your text:\n');

process.stdin.on('data', text => { 
    if (text.toString().trim() === 'exit') {
        process.stdout.write('\nBye bye!\n');
        process.exit();
    }
    writeStream.write(text);
});

process.on('SIGINT', function() {
    process.stdout.write('\nBye bye!\n');
    process.exit();
});