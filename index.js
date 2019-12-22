#!/usr/bin/env node

const yargs = require('yargs');
const { getPods } = require('./commands/get_pods');
const { getLogs } = require('./commands/get_logs');

// banner
const banner = require('fs').readFileSync('banner.txt').toString();

yargs
    .command(['get'], 'Get k8s pods for [env]',
        {
            // options
        }, async (argv) => {
            await getPods(argv, banner);
        })
    .command(['logs'], 'Get k8s pods for [name]',
        {
            name: { alias: 'n', type: 'string', required: true, desc: 'pod name for logs' }
        }, async (argv) => {
            await getLogs(argv, banner);
        })
    .option('env', { alias: 'e', type: 'string', required: true, default: 'qa', desc: 'env to get pods' })
    .demandCommand(1, '')
    .help()
    .wrap(72)
    .argv



// yargs.scriptName('kp')
//     .command('get', 'get k8s pods', async (yargs) => {
//         yargs.alias('e', 'env')
//             .demandOption('env')
//         await getPods(yargs, banner);
//     })
//     .command('logs', 'get pod logs', async (yargs) =>   {   
//         yargs.alias('n', 'pod name for logs')
//             .demandOption('name');
//         await getLogs(yargs, banner)
//     })
//     .help()
//     .showHelpOnFail(true)
//     .demandCommand(1, '').recommendCommands().strict()
//     .alias('h', 'help')
//     .argv

// require('yargs') // eslint-disable-line
//   .command('get [env]', 'get k8s pods for env', (yargs) => {
//     yargs
//       .positional('env', {
//         describe: 'env to get pods',
//         default: 'qa'
//       })
//   }, async (argv) => {
//     await getPods(argv, banner);
//   })
//   .option('verbose', {
//     alias: 'v',
//     type: 'boolean',
//     description: 'Run with verbose logging'
//   })
//   .argv

// .demandCommand().recommendCommands().strict()