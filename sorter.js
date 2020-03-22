const fs = require('fs').promises;
const path = require('path');
const Watcher = require('./watcher');
const program = require('./utils/commander');
program.parse(process.argv);
const del = require('del');
const handleError = require('./helper/errorhandler');
const Sorter = require('./utils/sortfiles');
const isAccessible = require('./helper/accessable');

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

(async function () {
    if (await isAccessible(program.folder)) {
        if (! await isAccessible(program.output)) {
            await fs.mkdir(program.output);
        }
        watcher.started();
        await sorter.SortFiles(program.folder);
    } else {
        handleError(`Not found folder: ${program.folder}`);
    }
})();

//node . -f ./files -o ./fonts -d