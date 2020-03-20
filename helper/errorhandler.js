const ExitCode = require('./exitcode');

module.exports = function (err) {
    console.log(err);
    process.exit(ExitCode.error);
}