#!/usr/bin/env node
const packageJson = require('./package.json');
const commands = require('./app/commands');

const util = require('./app/util');
const program = util.program;

program.version(packageJson.version, '-v, --version', 'show current version.')

program
    .option('-c, --commitPrefix <commitPrefix>', 'Prefix for commit message. Default is "[nexus-npm] - ".')
    .option('-r, --release', 'Create new release.')
    .option('-t, --tag <tag>', 'New tag name. If not informed, the version of package.json will be used.')
    .option('-p, --npmrcPath <npmrcPath>', 'Define path for \'.npmrc\' file.')
    .parse(global.process.argv);

program
    .command('verify')
    .description('Checks if the properties have been configured correctly.')
    .action(function () {
        util.execCommand(function () {
            commands.verify();
        })
    });

program
    .command('deploy')
    .description('Generates a new deploy.')
    .action(function () {
        util.execCommand(function () {
            commands.deploy();
        })
    });

program
    .command('clean')
    .description('Clean temporary files.')
    .action(function () {
        util.execCommand(function () {
            commands.clean();
        })
    });

program.command('rollback')
    .description('Rollback package.json')
    .action(function () {
        util.execCommand(function () {
            commands.rollback();
        })
    });

program.command('*')
    .action(function (env) {
        console.log('\n  Parameter "%s" not found.\n\tUse --help to see commands list.\n', env);
    });

program.parse(global.process.argv);
