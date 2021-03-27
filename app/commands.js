const fs = require('fs-extra');
const pr = require('properties-reader');
const log = require('module-log');
const shell = require('shelljs');

const program = require('./util').program;
const tag = require('./create-tag');
const release = require('./publish-release');
const snapshot = require('./publish-snapshot');
const rollback = require('./rollback');
const config = require('./config');

loadPackageJson = _ => {
    log.debug('Loading package.json');
    try {
        config.pkgJson = fs.readJsonSync('./package.json');
    } catch (err) {
        log.error(err)
    }
}

loadPackageJson();

function isCustomTag() {
    return program.opts().tag && program.opts().tag !== 'undefined';
}

function getTagName() {
    return isCustomTag() ? program.opts().tag : config.pkgJson.version;
}

function isCustomCommitPrefix() {
    return program.opts().commitPrefix && program.opts().commitPrefix !== 'undefined';
}

function getCommitPrefix() {
    return isCustomCommitPrefix() ? program.opts().commitPrefix : this.message.commitPrefix;
}

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
    npmrcPath: undefined,
    configProperties: {},
    verify() {
        this.loadConfig();

        const appName = config.pkgJson.name;
        const appVersion = config.pkgJson.version;

        if (appName === null || appName === undefined) {
            throw 'App name is undefined!';
        }
        if (appVersion === null || appVersion === undefined) {
            throw 'App version is undefined!';
        }
        if (!appVersion.endsWith('-SNAPSHOT')) {
            throw 'Version does not end with \'-SNAPSHOT\'!';
        }
        if (program.opts().release) {
            if (program.opts().tag === null || program.opts().tag === undefined) {
                this.config.tag = config.pkgJson.version.replace('-SNAPSHOT', '');
            } else {
                this.config.tag = program.tag;
            }
        }
        log.info('VALIDATION PASSED!');
    },
    loadConfig() {
        let npmrcPath = `${process.env.HOME}/.npmrc`;
        if (program.opts().npmrcPath !== null && program.opts().npmrcPath !== undefined) {
            npmrcPath = program.opts().npmrcPath
        }
        this.npmrcPath = npmrcPath
        log.debug(`Loading ${npmrcPath}`);
        this.configProperties = pr(npmrcPath);
    },
    backup() {
        log.debug('backup: package.json');
        fs.copySync('package.json', 'package.json.nxDeployBackup');
    },
    deploy() {
        this.verify();
        this.backup();
        let shellExitCode = 0;
        if (program.opts().release) {
            const tagName = getTagName();
            this.message.commitPrefix = getCommitPrefix();
            tag.createTag(config.pkgJson, tagName, this.message);
            shellExitCode = release.publishRelease(config.pkgJson.distributionManagement.releaseRegistry, this.npmrcPath);
            release.updatePkgVersion(config.pkgJson, this.message);
            rollback.clean();
        } else {
            snapshot.addDateToVersion(config.pkgJson);
            shellExitCode = snapshot.publishSnapshot(config.pkgJson.distributionManagement.snapshotRegistry, this.npmrcPath);
            rollback.rollback();
        }
        if (shellExitCode !== 0) {
            shell.echo('Error: npm publish failed.')
            shell.exit(shellExitCode);
        }
    },
    clean() {
        rollback.clean();
    },
    rollback() {
        rollback.rollback();
    },
};
