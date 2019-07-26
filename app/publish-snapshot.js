const shell = require('shelljs');
const moment = require('moment');
const fs = require('fs-extra');
const log = require('module-log');

module.exports = {
    publishSnapshot: function (snapshotRepository) {
        log.info(`publish snapshot => ${snapshotRepository}`);
        return shell.exec(`npm publish --registry=${snapshotRepository}`).code;
    },
    addDateToVersion: function (appConfig) {
        const now = moment().format('YYYYMMDD.HHmmss');
        appConfig.packageJson.version = `${appConfig.packageJson.version}.${now}`;
        fs.writeFileSync('package.json', JSON.stringify(appConfig.packageJson, null, 2));
    }
};
