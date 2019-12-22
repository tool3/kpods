#!/usr/bin/env node

const yargs = require('yargs');
const { getPods } = require('./commands/get_pods');
const { getPod } = require('./commands/get_pod');
const { getLogs } = require('./commands/get_logs');

// banner
const banner = require('fs').readFileSync('banner.txt').toString();

yargs
    .config(
        {
            url: 'https://k8s-ui.saas-dev.zerto.com',
            apiVersion: 'api/v1',
            token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJla3MtYWRtaW4tc2Fhcy10b2tlbi1nbW12dCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJla3MtYWRtaW4tc2FhcyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjM1MjUxYWQzLTE0ZjMtMTFlYS05ZmE5LTEyYzMwZDY3ODAxNyIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlLXN5c3RlbTpla3MtYWRtaW4tc2FhcyJ9.biaxbH2lF35HkiwSSUDDcyufIa34mpuV_fKkZ5HNetDpZ82M_Go7LIV4ec9Zrxzv2d2hYNJYEaLFqvQGOd32TfbokbnX7aPoOxywFHzlN7NGLZfdQrSSYLpJ338DVYPLFzqbt5N4X_N3O9-a4VxinhiUEp2OeKBuT9t4WJmeKwtJ88M_4P5uzxl5vO7yGQDG8e-hUJz4Sh0is61K4s1Ih-U12MzCDJFtWB81t69L_rlKPKsH2hosYQK_OLop_3GpSWfGQ1Y7L7jZvg1RdhXv8Vdf_AzaGplWOb0y-hul7nDtJqAi9IQ32i4wyx2CZUQB_EqtBZvfxeS_js9cjqO1aA',

        })
    .command(['get [name]', 'get'], 'Get k8s pods for [env]', {}, async argv => {
        argv.name = argv._[1] || argv.name;
        if (argv.name) {
            return await getPod(argv, banner)
        }
        return await getPods(argv, banner);
    })
    .command(['logs [name]'], 'Get k8s pods for [name]', { name: { alias: 'n', type: 'string', desc: 'pod name', required: true } }, async argv => {
        return await getLogs(argv, banner);
    })
    .option('env', { alias: 'e', type: 'string', default: 'qa', desc: 'env to get pods' })
    .option('name', { type: 'string', requiresArg: true, desc: 'pod name', required: false })
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