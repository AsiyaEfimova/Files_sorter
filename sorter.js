const fs = require('fs');
const path = require('path');

const baseDir = process.argv[2] || './files';
const newDir = process.argv[3] || './fonts';
const statusOptions = {
    error: 1,
    success: 0
};

const MakeDir = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};

const CopyFile = (file, newPath) => {
    fs.link(file, newPath, err => {
        if (err) {
            console.error(err.message);
            process.exit(statusOptions.error);
        }
    });
};

const SortFiles = (base) => {
    fs.readdir(base, (err, files) => {
        if (err) {
            console.error(err.message);
            return;
        }
        MakeDir(newDir);
        for (const file of files) {
            const localBase = path.join(base, file);
            const state = fs.statSync(localBase);
            if (state.isDirectory()) {
                SortFiles(localBase);
            } else {
                if(file[0]!=='.'){
                    MakeDir(`${newDir}/${file[0].toUpperCase()}`);
                    CopyFile(`./${base}/${file}`, `${newDir}/${file[0].toUpperCase()}/${file}`);
                }
            }
        }
    });
};

SortFiles(baseDir);