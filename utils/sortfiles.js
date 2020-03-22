const fs = require('fs').promises;
const path = require('path');
const handleError = require('../helper/errorhandler');
const isAccessible = require('../helper/accessable');
const program = require('../utils/commander');

class SortFiles {
    constructor(params) {
        this.mainDir = params.directory;
        this.watcher = params.watcher;
    }
    async MakeDir(path) {
        try {
            if (! await isAccessible(path)) {
                await fs.mkdir(path);
            }
        } catch (err) {
            handleError(err);
        }
    }
    async CopyFile(file, newPath) {
        try {
            await fs.link(file, newPath);
        } catch (err) {
            handleError(err);
        }
    }
    async SortFiles(base) {
        try {
            this.watcher.startProccess(base);
            const files = await fs.readdir(base);
            for (const file of files) {
                const localBase = path.join(base, file);
                const state = await fs.stat(localBase);
                if (state.isDirectory()) {
                    await this.SortFiles(localBase);
                } else {
                    if (file[0] !== '.') {
                        await this.MakeDir(`${program.output}/${file[0].toUpperCase()}`);
                        await this.CopyFile(`./${base}/${file}`, `${program.output}/${file[0].toUpperCase()}/${file}`);
                    }
                }
            }
            this.watcher.endProccess(base);
        } catch (err) {
            handleError(err);
        }
    }
}
module.exports = SortFiles;