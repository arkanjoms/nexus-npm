const shell = require('shelljs');
const fs = require('fs-extra');
const log = require('module-log');

module.exports = {
    nxConfig: {
        generatedTag: ''
    },
    createTag: function (pkgConfig, tag, message) {
        log.debug('Creating tag ' + tag);
        pkgConfig.version = pkgConfig.version.replace('-SNAPSHOT', '');
        fs.writeFileSync('package.json', JSON.stringify(pkgConfig, null, 2));
        fs.writeFileSync('version.txt', pkgConfig.version);

        shell.exec(`git commit --untracked=no -am "${message.commitPrefix}${message.createTagSufix}"`);

        if (shell.exec(`git tag -a ${tag} -m "${message.commitPrefix}${message.createTagSufix}"`).code !== 0) {
            throw 'Tag error';
        }
        if (shell.exec('git push --tags').code !== 0) {
            throw 'Push error';
        }
    }
};
