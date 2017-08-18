var fs = require('fs-extra');
var log = require('module-log');

module.exports = {

    clean: function () {

        log.info('Cleaning files.');
        fs.unlink('package.json.nxDeployBackup');
    },

    rollback: function () {

        log.info('Rollback files.');
        var packageJson = JSON.parse(fs.readFileSync('package.json.nxDeployBackup', 'utf8', function (err) {
            if (err) throw err;
        }));

        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

        this.clean();
    }
};
