const log = require('module-log');
const {Command} = require('commander');

const program = new Command();

module.exports = {
    program: program,
    execCommand: fn => {
        const showError = function (err) {
            if (typeof err === 'string') {
                log.error(err);
            } else {
                log.error(err.message);
            }
        };

        try {
            fn(showError);
        } catch (e) {
            showError(e);
            process.exit(1);
        }
    },
};
