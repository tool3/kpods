const ora = require('ora');
const axios = require('axios');
const Table = require('cli-table3');
const chalk = require('chalk');

const table = new Table({ style: { head: [], border: [] } });
const services = {};
const colors = { 'Running': '#77FF8D', 'Error': '#ff0000', 'Creating': '#ffa500' };

const getPods = async (argv, banner) => {
    process.stdout.write(`${banner}\n`);
    const { url, token, env, apiVersion } = argv;
    const suffix = `${apiVersion}/pod/${env}`;
    const fullUrl = `${url}/${suffix}?Authorization=${token}`;
    const spinner = ora(`Getting pods for ${chalk.bold(env)}`).start();

    try {
        const { data } = await axios.get(fullUrl, { headers: { Authorization: `Bearer ${token}` } });

        if (data.pods.length > 0) {
            spinner.succeed();
            data.pods.map(service => {
                const { name, labels: { subsystem }, namespace, creationTimestamp } = service.objectMeta;
                const { podStatus: { status }, restartCount } = service;

                if (!services[subsystem]) {
                    services[subsystem] = [];
                }

                services[subsystem].push({ name, subsystem, status, namespace, creationTimestamp, restartCount, color: colors[status] });
            });

            Object.keys(services).map(subsystem => {

                table.push([{ colSpan: 5, content: chalk.bold(subsystem), hAlign: 'center' }],
                    [{ content: 'name', hAlign: 'center' },
                    { content: 'status', hAlign: 'center' },
                    { content: 'env', hAlign: 'center' },
                    { content: 'created', hAlign: 'center' },
                    { content: '↩' }])

                services[subsystem].map(service => {
                    let metaData = [service.name, service.status, service.namespace, new Date(service.creationTimestamp).toLocaleString(), service.restartCount];
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

module.exports = { getPods }