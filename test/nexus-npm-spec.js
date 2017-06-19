var exec = require('child_process').exec;
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var rootDir = path.dirname(__dirname);
var pathWithoutPackageJson = path.dirname(__dirname) + '/test';

describe('[verify]', function () {

    it('package.json not present', function (done) {
        exec('nexus-npm verify', {cwd: pathWithoutPackageJson}, function (error, stdout, stderr) {
            console.log(pathWithoutPackageJson);
            expect(error).to.not.null;
            done();
        });
    });

    it('package.json present', function (done) {
        exec('nexus-npm verify', {cwd: rootDir}, function (error, stdout, stderr) {
            expect(error).to.not.null;
            console.log(stdout);
            done();
        });
    });
});
