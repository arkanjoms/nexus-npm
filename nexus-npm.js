#!/usr/bin/env node
const commander = require('commander');

const constants = require('./app/constants');
const util = require('./app/util');
const commands = require('./app/commands');

commander.version(constants.appVersion)
    .option('-c, --commitPrefix [commigPrefix]', 'Prefix for commit message. Deafault is "[nexus-npm] -".')
    .option('-r, --release', 'Create new release.')
    .option('-t, --tag [tag]', 'New tag name. If not informed, the version of package.json will be used.')
    .parse(global.process.argv);

commander.command('verify')
    .description('Checks if the properties have been configured correctly.')
    .action(function () {
        util.execCommand(function () {
            commands.verify();
        })
    });

commander.command('deploy')
    .description('Generates a new deploy.')
    .action(function () {
        util.execCommand(function () {
            commands.deploy();
        })
    });

commander.command('clean')
    .description('Clean temporary files.')
    .action(function () {
        util.execCommand(function () {
            commands.clean();
        })
    });

commander.command('rollback')
    .description('Rollback package.json')
    .action(function () {
        util.execCommand(function () {
            commands.rollback();
        })
    });

commander.command('*')
    .action(function (env) {
        console.log('\n  Parameter "%s" not found.\n\tUse --help to see commands list.\n', env);
    });

commander.parse(global.process.argv);
