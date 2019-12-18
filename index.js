#!/usr/bin/env node

const yargs = require('yargs');
const { getPods } = require('./commands/get_pods');

// banner
const banner = require('fs').readFileSync('banner.txt').toString();

yargs.scriptName('kp')
    .command('$0', 'get k8s pods', async (yargs) => await getPods(yargs, banner))
    .describe('env', 'k8s env to get pods')
    .alias('e', 'env')
    .demandOption(['env'])
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