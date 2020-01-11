#!/usr/bin/env node

const yargs = require('yargs');
const path = require('path');
const { getPods } = require('./commands/get_pods');
const { getPod } = require('./commands/get_pod');
const { getLogs } = require('./commands/get_logs');
const { execPod } = require('./commands/exec_pod');

// banner
const banner = require('fs').readFileSync(path.join(__dirname, './banner/banner.txt')).toString();

yargs
    .config(
        {
            url: process.env.KP_URL,
            apiVersion: 'api/v1',
            token: process.env.KP_TOKEN,

        })
    .command(['get [name]', 'g'], 'Get pods|s', { name: { alias: 'n', type: 'string', desc: 'pod name', positional: true }, label: { alias: 'l', type: 'string', desc: 'label to group by', default: 'subsystem' } }, async argv => {
        argv.name = argv._[1] || argv.name;
        return argv.name ? await getPod(argv, banner) : await getPods(argv, banner);
    })
    .command(['logs <name>', 'l'], 'Get pod logs', {}, async argv => {
        return await getLogs(argv, banner);
    })
    .command(['exec <name>'], 'Exec pod', {}, async argv => {
        return await execPod(argv, banner);
    })
    .example('$0 get', 'get all pods in env')
    .example('$0 get -e dev', 'get pods in dev namespace')
    .example('$0 get [name]', 'get pod specific info')
    .option('env', { alias: 'e', type: 'string', default: process.env.KP_ENV || 'KP_ENV', desc: 'env to get pods', required: true })
    .option('url', { alias: 'u', type: 'string', default: 'KP_URL', desc: 'k8s dashboard url', required: true })
    .option('token', { alias: 't', type: 'string', default: 'KP_TOKEN', desc: 'bearer token', required: true })
    .demandCommand(1, '')
    .help()
    .wrap(72)
    .argv