var commander = require('commander');
var log = require('module-log');

module.exports = {

    execCommand: function (fn) {
        var showError = function (err) {
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
    }
};
