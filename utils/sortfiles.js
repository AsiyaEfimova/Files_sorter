const fs = require('fs');
const path = require('path');
const handleError = require('../helper/errorhandler');
const program = require('../utils/commander');

class SortFiles {
    constructor(params) {
        this.mainDir = params.directory;
        this.watcher = params.watcher;
    }
    MakeDir(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }
    CopyFile(file, newPath) {
        fs.link(file, newPath, err => {
            if (err) {
                handleError(err);
            }
        });
    }
    SortFiles(base) {
        this.watcher.startProccess(base);
        fs.readdir(base, (err, files) => {
            if (err) {
                handleError(err);
            }
            for (const file of files) {
                const localBase = path.join(base, file);
                const state = fs.statSync(localBase);
                if (state.isDirectory()) {
                    this.SortFiles(localBase);
                } else {
                    if (file[0] !== '.') {
                        this.MakeDir(`${program.output}/${file[0].toUpperCase()}`);
                        this.CopyFile(`./${base}/${file}`, `${program.output}/${file[0].toUpperCase()}/${file}`);
                    }
                }
            }
            this.watcher.endProccess(base);
        });
    }
}
module.exports = SortFiles;