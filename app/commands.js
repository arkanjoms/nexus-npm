const fs = require('fs-extra');
const pr = require('properties-reader');
const commander = require('commander');
const log = require('module-log');
const shell = require('shelljs');

const tag = require('./create-tag');
const release = require('./publish-release');
const snapshot = require('./publish-snapshot');
const rollback = require('./rollback');

module.exports = {
    message: {
        commitPrefix: '[nexus-npm] -',
        createTagSufix: ' prepare tag ',
        nextDevelopmentSufix: ' prepare next development version ',
        branchSufix: 'prepare branch ',
        rollback: 'rollback tag '
    },
    config: {
        tag: undefined,
        nextDevelopmentVersion: undefined,
        currentDevelopmentVersion: undefined
    },
    appConfig: {
        packageJson: {}
    },
    globalConfig: {
        properties: {}
    },
    verify: function () {
        this.loadConfig();

        const appName = this.appConfig.packageJson.name;
        const appVersion = this.appConfig.packageJson.version;

        if (appName === null || appName === undefined) {
            throw 'App name is undefined!';
        }
        if (appVersion === null || appVersion === undefined) {
            throw 'App version is undefined!';
        }
        if (!appVersion.endsWith('-SNAPSHOT')) {
            throw 'Version does not end with \'-SNAPSHOT\'!';
        }
        if (commander.release) {
            if (commander.tag === null || commander.tag === undefined) {
                this.config.tag = this.appConfig.packageJson.version.replace('-SNAPSHOT', '');
            } else {
                this.config.tag = commander.tag;
            }
        }
        log.debug('VALIDATION PASSED!');
    },
    loadConfig: function () {
        log.debug('Loading package.json');
        this.appConfig.packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        log.debug('Loading ~/.npmrc');
        this.globalConfig.properties = pr(process.env.HOME + '/.npmrc');
    },
    backup: function () {
        log.debug('backup: package.json');
        fs.copySync('package.json', 'package.json.nxDeployBackup');
    },
    deploy: function () {
        this.verify();
        this.backup();
        let shellExitCode = 0;
        if (commander.release) {
            tag.createTag(this.appConfig, this.config.tag, this.message);
            shellExitCode = release.publishRelease(this.appConfig.packageJson.distributionManagement.releaseRegistry);
            release.updatePkgVersion(this.appConfig, this.message);
            rollback.clean();
        } else {
            snapshot.addDateToVersion(this.appConfig);
            shellExitCode = snapshot.publishSnapshot(this.appConfig.packageJson.distributionManagement.snapshotRegistry);
            rollback.rollback();
        }
        if (shellExitCode !== 0) {
            shell.echo('Error: npm publish failed.')
            shell.exit(shellExitCode);
        }
    },
    clean: function () {
        rollback.clean();
    },
    rollback: function () {
        rollback.rollback();
    }
};
