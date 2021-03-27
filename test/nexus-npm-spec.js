const {exec} = require('child_process');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const rootDir = path.dirname(__dirname);
const pathWithoutPackageJson = path.dirname(__dirname) + '/test';
const pathExampleApp = path.dirname(__dirname) + '/test/example-app';
const packageJson = require(rootDir + '/package.json')

describe('[verify]', function () {

    it('package.json not present', done => {
        exec('node ../nexus-npm.js verify', {cwd: pathWithoutPackageJson}, (error, stdout) => {
            expect(error).to.not.null;
            expect(stdout).contains('ENOENT: no such file or directory, open \'./package.json\'');
            done();
        });
    });

    it('npmrc file not present', done => {
        exec('node ./../../nexus-npm.js verify --npmrcPath notfoundnpmrcfile', {cwd: pathExampleApp}, (error, stdout) => {
            expect(error).to.not.null;
            expect(stdout).contains(`ENOENT: no such file or directory, open 'notfoundnpmrcfile'`);
            done();
        });
    });

    it('app version contains \"-SNAPSHOT\"', done => {
        exec('node nexus-npm.js verify --npmrcPath ./test/npmrctestfile', {cwd: rootDir}, (error, stdout) => {
            expect(error).to.not.null;
            expect(stdout).contains('Version does not end with \'-SNAPSHOT\'!');
            done();
        });
    });

    it('Configuration is OK', done => {
        exec('node ./../../nexus-npm.js verify --npmrcPath ./../npmrctestfile', {cwd: pathExampleApp}, (error, stdout) => {
            expect(error).to.be.null;
            expect(stdout).contains('VALIDATION PASSED!');
            done();
        });
    });

    it('check version is same in package.json', done => {
        exec('node ./nexus-npm.js --version', {cwd: rootDir}, (error, stdout) => {
            expect(error).to.be.null;
            expect(stdout).contains(packageJson.version);
            done();
        });
    });
});
