const fs = require('fs');
const path = require('path');

const baseDir = process.argv[2],
    newDir = process.argv[3],
    remove = (process.argv[4] == 'true');

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
    });
};

const MoveFile = (file, newPath) => {
    fs.rename(file, newPath, err => {
        if (err) {
            console.error(err.message);
            return;
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
        for(let file of files){
            let localBase = path.join(base, file);
            let state = fs.statSync(localBase);
            if (state.isDirectory()) {
                SortFiles(localBase);
            } else {
                if(remove){
                    if(file[0]==='.'){
                        fs.unlinkSync(`./${base}/${file}`);
                    }else{
                        MakeDir(`./fonts/${file[0].toUpperCase()}`);
                        MoveFile(`./${base}/${file}`, `./fonts/${file[0].toUpperCase()}/${file}`);
                    }
                }else{
                    if(file[0]!=='.'){
                        MakeDir(`./fonts/${file[0].toUpperCase()}`);
                        CopyFile(`./${base}/${file}`, `./fonts/${file[0].toUpperCase()}/${file}`);
                    }
                }
            }
        }
    });
}

SortFiles(baseDir);