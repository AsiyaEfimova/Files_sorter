const fs = require('fs');
const path = require('path');

const baseDir = process.argv[2];
const newDir = process.argv[3];
const remove = (process.argv[4] === 'true');
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

const MoveFile = (file, newPath) => {
    fs.rename(file, newPath, err => {
        if (err) {
            console.error(err.message);
            process.exit(statusOptions.error);
        }
    });
};

const RemoveDir = (folder) => {
    console.log(folder);
    fs.unlink(folder, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
};

const WatchDir = (dir) => {
    fs.watch(dir, {recursive:true}, (change, filename) => {
        let folder = path.dirname(filename);
        fs.readdir(folder, (err, files) => {
            if(!files){
                RemoveDir(`${baseDir}/${folder}`);
            }
        });
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
};

if(remove){
    WatchDir(baseDir);
}
SortFiles(baseDir);