const shell = require('shelljs');
const fs = require('fs-extra');
const log = require('module-log');

module.exports = {
    publishRelease: function (releaseRegistry, configPath) {
        log.debug(`publish release using userconfig file ${configPath}`);
        return shell.exec(`npm --userconfig ${configPath} publish --registry=${releaseRegistry}`).code;
    },
    updatePkgVersion: function (appConfig, message) {
        const versionArray = appConfig.packageJson.version.split('.');
        versionArray[versionArray.length - 1] = parseInt(versionArray[versionArray.length - 1]) + 1;
        appConfig.packageJson.version = `${versionArray.join('.')}-SNAPSHOT`;
        fs.writeFileSync('package.json', JSON.stringify(appConfig.packageJson, null, 2));

        shell.exec(`git commit -am "${message.commitPrefix}${message.nextDevelopmentSufix}"`);
        shell.exec('git push');
    }
};
