var shell = require('shelljs');
var fs = require('fs-extra');
var log = require('module-log');

module.exports = {
    publishRelease: function (releaseRegistry) {
        log.debug('publish release');
        return shell.exec('npm publish --registry=' + releaseRegistry).code;
    },
    updatePkgVersion: function (appConfig, message) {
        var versionArray = appConfig.packageJson.version.split('.');
        versionArray[versionArray.length - 1] = parseInt(versionArray[versionArray.length - 1]) + 1;
        appConfig.packageJson.version = versionArray.join('.') + '-SNAPSHOT';
        fs.writeFileSync('package.json', JSON.stringify(appConfig.packageJson, null, 2));

        shell.exec('git commit -am "' + message.commitPrefix + message.nextDevelopmentSufix + '"');
        shell.exec('git push');
    }
};
