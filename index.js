#!/usr/bin/env node

const yargs = require('yargs');
const { getPods } = require('./commands/get_pods');
const { getLogs } = require('./commands/get_logs');

// banner
const banner = require('fs').readFileSync('banner.txt').toString();

yargs.scriptName('kp')
    .command('*', 'get k8s pods', async (yargs) => {
        yargs.alias('e', 'env')
            .demandOption('env')
        await getPods(yargs, banner);
    })
    .command('logs', 'get pod logs', async (yargs) => {
        yargs.alias('n', 'pod name for logs')
            .demandOption('name');
        await getLogs(yargs, banner)
    })
    .showHelpOnFail(true)
    .demandCommand(1, '')
    .alias('h', 'help')
    .argv


// yargs
//     .usage('Usage: $0 <command> [options]')
//     .command('*', 'Get k8s pods by env', () => getPods())
//     .alias('f', 'file')
//     .nargs('f', 1)
//     .describe('f', 'Load a file')
//     .demandOption(['f'])
//     .help('h')
//     .alias('h', 'help')
//     .argv;