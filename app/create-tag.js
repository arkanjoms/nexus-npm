const shell = require('shelljs');
const fs = require('fs-extra');
const log = require('module-log');

module.exports = {
    nxConfig: {
        generatedTag: ''
    },
    createTag: function (appConfig, tag, message) {
        log.debug('Creating tag ' + tag);
        appConfig.packageJson.version = appConfig.packageJson.version.replace('-SNAPSHOT', '');
        fs.writeFileSync('package.json', JSON.stringify(appConfig.packageJson, null, 2));
        fs.writeFileSync('version.txt', appConfig.packageJson.version);

        shell.exec(`git commit --untracked=no -am "${message.commitPrefix}${message.createTagSufix}"`);

        if (shell.exec(`git tag -a ${tag} -m "${message.commitPrefix}${message.createTagSufix}"`).code !== 0) {
            throw 'Tag error';
        }
        if (shell.exec('git push --tags').code !== 0) {
            throw 'Push error';
        }
    }
};
