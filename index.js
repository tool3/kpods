#!/usr/bin/env node

const yargs = require('yargs');
const path = require('path');
const { getPods } = require('./commands/get_pods');
const { getPod } = require('./commands/get_pod');
const { getLogs } = require('./commands/get_logs');

// banner
const banner = require('fs').readFileSync(path.join(__dirname, './banner/banner.txt')).toString();

yargs
    .config(
        {
            url: process.env.KP_URL,
            apiVersion: 'api/v1',
            token: process.env.KP_TOKEN,

        })
    .command(['get [name]', 'g'], 'Get pods|s', { name: { alias: 'n', type: 'string', desc: 'pod name', positional: true } }, async argv => {
        argv.name = argv._[1] || argv.name;
        return argv.name ? await getPod(argv, banner) : await getPods(argv, banner);
    })
    .example('$0 get', 'get all pods in env')
    .example('$0 get [name]', 'get pod specific info')
    .command(['logs <name>', 'l'], 'Get pod logs', {}, async argv => {
        return await getLogs(argv, banner);
    })
    // .command(['dep [name]', 'd'], 'Get deployments', {}, async argv => {
    //     return await getDeployments(argv, banner);
    // })
    .option('env', { alias: 'e', type: 'string', default: 'qa', desc: 'env to get pods' })
    .demandOption('url')
    .demandCommand(1, '')
    .help()
    .wrap(72)
    .argv