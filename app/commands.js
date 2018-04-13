var fs = require('fs-extra');
var pr = require('properties-reader');
var commander = require('commander');
var log = require('module-log');

var tag = require('./create-tag');
var release = require('./publish-release');
var snapshot = require('./publish-snapshot');
var rollback = require('./rollback');

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

        var appName = this.appConfig.packageJson.name;
        var appVersion = this.appConfig.packageJson.version;

        if (appName === null || appName === undefined) {
            throw "App name is undefined!";
        }
        if (appVersion === null || appVersion === undefined) {
            throw "App version is undefined!";
        }
        if (!appVersion.endsWith('-SNAPSHOT')) {
            throw "Version does not end with '-SNAPSHOT'!";
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
        log.debug("Loading package.json");
        this.appConfig.packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        log.debug("Loading ~/.npmrc");
        this.globalConfig.properties = pr(process.env.HOME + '/.npmrc');
    },
    backup: function () {
        log.debug('backup: package.json');
        fs.copySync('package.json', 'package.json.nxDeployBackup');
    },
    deploy: function () {
        this.verify();
        this.backup();
        if (commander.release) {
            tag.createTag(this.appConfig, this.config.tag, this.message);
            release.publishRelease(this.appConfig.packageJson.distributionManagement.releaseRegistry);
            release.updatePkgVersion(this.appConfig, this.message);
            rollback.clean();
        } else {
            snapshot.addDateToVersion(this.appConfig);
            snapshot.publishSnapshot(this.appConfig.packageJson.distributionManagement.snapshotRegistry);
            rollback.rollback();
        }
    },
    clean: function () {
        rollback.clean();
    },
    rollback: function () {
        rollback.rollback();
    }
};
