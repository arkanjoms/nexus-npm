const fs = require('fs-extra');
const log = require('module-log');

module.exports = {
    clean: function () {
        log.info('Cleaning files.');
        fs.unlink('package.json.nxDeployBackup');
    },
    rollback: function () {
        log.info('Rollback files.');
        const packageJson = JSON.parse(fs.readFileSync('package.json.nxDeployBackup', 'utf8', function (err) {
            if (err) throw err;
        }));

        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

        this.clean();
    }
};
