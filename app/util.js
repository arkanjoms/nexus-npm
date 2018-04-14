var log = require('module-log');

var constants = require('./constants');

module.exports = {
    execCommand: function (fn) {
        log.debug(constants.appVersion);
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
