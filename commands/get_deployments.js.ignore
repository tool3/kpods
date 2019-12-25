const ora = require('ora');
const axios = require('axios');
const Table = require('cli-table3');
const chalk = require('chalk');
const { colors } = require('../constants/colors');

const table = new Table({ style: { head: [], border: [] } });
const services = {};

const getDeployments = async (argv, banner) => {
    process.stdout.write(`${banner}\n`);
    const { url, token, env, apiVersion } = argv;
    const suffix = `${apiVersion}/deployment/${env}?itemsPerPage=100&page=1&sortBy=d,creationTimestamp`;
    const fullUrl = `${url}/${suffix}?Authorization=${token}`;
    const spinner = ora(`Getting deployments for ${chalk.bold(env)}`).start();

    try {
        const { data: { deployments } } = await axios.get(fullUrl, { headers: { Authorization: `Bearer ${token}` } });

        if (deployments.length > 0) {
            spinner.succeed();
            deployments.map(service => {
                const { name, labels: { subsystem, chart }, namespace, creationTimestamp } = service.objectMeta;
                const { podStatus: { status }, restartCount } = service;

                if (!services[subsystem]) {
                    services[subsystem] = [];
                }

                services[subsystem].push({ name, subsystem, status, namespace, chart, creationTimestamp, restartCount, color: colors[status] });
            });

            Object.keys(services).map(subsystem => {
                table.push([{ colSpan: 6, content: chalk.bold(subsystem), hAlign: 'center' }],
                    [{ content: 'name', hAlign: 'center' },
                    { content: 'status', hAlign: 'center' },
                    { content: 'env', hAlign: 'center' },
                    { content: 'chart', hAlign: 'center' },
                    { content: 'created', hAlign: 'center' },
                    { content: '↩', hAlign: 'center' }])

                services[subsystem].map(service => {
                    let metaData = [service.name, service.status, service.namespace, service.chart, new Date(service.creationTimestamp).toLocaleString(), service.restartCount];
                    metaData = metaData.map(item => chalk.hex(service.color || '#ff0000')(item));
                    table.push(metaData);
                })
            });

            console.log(table.toString());
        } else {
            throw `no pods info in env ${args.env}`
        }

    } catch (e) {
        spinner.fail();
        const err = e.errno || e;
        console.error(chalk.redBright(err));
    };
}

module.exports = { getDeployments }