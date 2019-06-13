var shell = require('shelljs');
var moment = require('moment');
var fs = require('fs-extra');
var log = require('module-log');

module.exports = {
    publishSnapshot: function (snapshotRepository) {
        log.info('publish snapshot => ' + snapshotRepository);
        return shell.exec('npm publish --registry=' + snapshotRepository).code;
    },

    addDateToVersion: function (appConfig) {
        var now = moment().format('YYYYMMDD.HHmmss');
        appConfig.packageJson.version = appConfig.packageJson.version + "." + now;
        fs.writeFileSync('package.json', JSON.stringify(appConfig.packageJson, null, 2));
    }
};
