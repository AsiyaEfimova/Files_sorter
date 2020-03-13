const fs = require('fs');
const path = require('path');

const base = './files';

const MakeDir = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};

const CopyFile = (file, newPath) => {
    fs.link(file, newPath, err => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.error('done');
    });
};

const SortFiles = (base) => {
    const files = fs.readdirSync(base);
    MakeDir('./fonts');
    files.forEach(item => {
        let localBase = path.join(base, item);
        let state = fs.statSync(localBase);
        if (state.isDirectory()) {
            console.log('DIR: ' + item);
            SortFiles(localBase);
        } else {
            console.log('File: ' + item[0]);
            MakeDir(`./fonts/${item[0].toUpperCase()}`);
            CopyFile(`./${base}/${item}`, `./fonts/${item[0].toUpperCase()}/${item}`);
        }
    });
}

SortFiles(base);