const { program } = require('commander');

module.exports = program
    .version('0.0.1')
    .option('-f, --folder <type>', 'Input folder for sorting', './files')
    .option('-o, --output <type>', 'Input output folder', './fonts')
    .option('-d, --delete', 'Delete folder for sorting');