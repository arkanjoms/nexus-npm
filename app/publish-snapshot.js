const shell = require('shelljs');
const moment = require('moment');
const fs = require('fs-extra');
const log = require('module-log');

module.exports = {
    publishSnapshot: function (snapshotRepository, configPath) {
        log.info(`publish snapshot => ${snapshotRepository}`);
        return shell.exec(`npm --userconfig ${configPath} publish --registry=${snapshotRepository}`).code;
    },
    addDateToVersion: function (pkgJson) {
        const now = moment().format('YYYYMMDD.HHmmss');
        pkgJson.version = `${pkgJson.version}.${now}`;
        fs.writeFileSync('package.json', JSON.stringify(pkgJson, null, 2));
    }
};
