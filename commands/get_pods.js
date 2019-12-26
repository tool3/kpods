const ora = require('ora');
const axios = require('axios');
const Table = require('cli-table3');
const chalk = require('chalk');
const { colors } = require('../constants/colors');
const { createPie, createStatisticsCharts, displayTimeRange } = require('../utils/utils');

const table = new Table({ style: { head: [], border: [] } });
const services = {};

const getPods = async (argv, banner) => {
    process.stdout.write(`${banner}\n`);
    const { url, token, env, apiVersion } = argv;
    const suffix = `${apiVersion}/pod/${env}`;
    const fullUrl = `${url}/${suffix}?Authorization=${token}`;
    const spinner = ora(`Getting pods in ${chalk.bold(env)}`).start();

    try {
        const { data } = await axios.get(fullUrl, { headers: { Authorization: `Bearer ${token}` } });

        if (data.pods.length > 0) {
            spinner.succeed();
            data.pods.map(service => {
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
                    { content: '↩', hAlign: 'center' }]
                )

                services[subsystem].map(service => {
                    let metaData = [service.name, service.status, service.namespace, service.chart, new Date(service.creationTimestamp).toLocaleString(), service.restartCount];
                    metaData = metaData.map(item => chalk.hex(service.color || '#f54029')(item));
                    table.push(metaData);
                })
            });

            const healthStatuses = data.status;
            // charts
            const { cpu, ram } = createStatisticsCharts(data.cumulativeMetrics, 38, 15);
            // total pod health pie
            const pie = createPie(healthStatuses);

            table.push([{ colSpan: 6, content: `${chalk.bold('Total Pods Stats')}`, hAlign: 'center' }])
            table.push([{ content: pie.toString() }, { colSpan: 3, content: `Total CPU (millicores)\n\n${cpu.chart}`, hAlign: 'center' }, { content: `Total RAM (MB) \n\n${ram.chart}`, colSpan: 2, hAlign: 'center' }]);

            console.log(table.toString());


        } else {
            throw `No pods info in env ${argv.env}`
        }

    } catch (e) {
        spinner.fail();
        const err = e.errno || e;
        console.error(chalk.redBright(err));
    }
}

module.exports = { getPods }