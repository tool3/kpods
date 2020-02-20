#!/usr/bin/env node

const yargs = require('yargs');
const path = require('path');
const { getPods } = require('./commands/get_pods');
const { getPod } = require('./commands/get_pod');
const { getLogs } = require('./commands/get_logs');
const { execPod } = require('./commands/exec_pod');
const { getPodFilter } = require('./commands/get_pod_filter');

// banner
const banner = require('fs').readFileSync(path.join(__dirname, './banner/banner.txt')).toString();

yargs
    .config(
        {
            url: process.env.KP_URL,
            apiVersion: 'api/v1',
            token: process.env.KP_TOKEN,

        })
    .command(['get [name..]', 'g'], 'Get pods|s',
        {
            name: { alias: 'n', type: 'string', desc: 'pod name', positional: true },
            label: { alias: 'l', type: 'string', desc: 'label to group by', default: 'subsystem' },
            filter: { alias: 'f', type: 'string', desc: 'filter pods by name' },
            status: { alias: 's', type: 'string', desc: 'filter pods by status' },
        }, async argv => {
            argv.name = argv._[1] || argv.name;
            if (argv.name) {
                await getPod(argv, banner)
            } else if (argv.filter) {
                await getPodFilter(argv, banner);
            } else {
                await getPods(argv, banner, argv.status)
            }
        })
    .command(['logs <name>', 'l'], 'Get pod logs', { watch: { alias: 'w', type: 'boolean', desc: 'continously fetch logs' }, interval: { alias: 'i', type: 'number', desc: 'interval in seconds for fetching logs', default: 3 } }, async argv => {
        return await getLogs(argv, banner);
    })
    .command(['exec <name>'], 'Exec pod', {}, async argv => {
        return await execPod(argv, banner);
    })
    .example('$0 get', 'get pods list in env')
    .example('$0 get -e dev', 'get pods list in dev namespace')
    .example('$0 get -s failed', 'get pods list with failed status')
    .example('$0 get [pod-name]', 'get a single pod specific info for [pod-name]')
    .example('$0 get -f views', 'get pods specific info filtered by name')
    .option('env', { alias: 'e', type: 'string', default: process.env.KP_ENV || 'KP_ENV', desc: 'namespace to get pods', required: true })
    .option('url', { alias: 'u', type: 'string', default: 'KP_URL', desc: 'k8s dashboard url', required: true })
    .option('token', { alias: 't', type: 'string', default: 'KP_TOKEN', desc: 'bearer token', required: true })
    .demandCommand(1, '')
    .help()
    .wrap(72)
    .argv