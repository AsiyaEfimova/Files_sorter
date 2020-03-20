const fs = require('fs');
const path = require('path');
const Watcher = require('./watcher');
const program = require('./utils/commander');
program.parse(process.argv);
const del = require('del');
const handleError = require('./helper/errorhandler');
const Sorter = require('./utils/sortfiles');

const watcher = new Watcher(() => {
    console.log('Sorting completed');
    if (program.delete) {
        del(program.folder).then(() => {
            console.log('Delete folder');
        });
    }
});

const sorter = new Sorter({
    directory: program.output,
    watcher: watcher
});

if (!fs.existsSync(program.folder)) {
    handleError(`Not found folder: ${program.folder}`);
} else {
    if (!fs.existsSync(program.output)) {
        fs.mkdirSync(program.output);
    }
    sorter.SortFiles(program.folder);
    watcher.started();
}