const ora = require('ora');
const axios = require('axios');
const Table = require('cli-table3');
const chalk = require('chalk');
const moment = require('moment');
const Pie = require('cli-pie');
const { colors } = require('../constants/colors');
const { createPie, createStatisticsCharts } = require('../utils/utils');

const table = new Table({ style: { head: [], border: [] } });
const services = {};

const getPods = async (argv, banner) => {
    process.stdout.write(`${banner}\n`);
    const { url, token, env, apiVersion } = argv;
    const suffix = `${apiVersion}/pod/${env}`;
    const fullUrl = `${url}/${suffix}?Authorization=${token}`;
    const spinner = ora(`Getting pods in ${chalk.bold(env)}`).start();

    const defaultLabel = argv.label;

    try {
        const { data } = await axios.get(fullUrl, { headers: { Authorization: `Bearer ${token}` } });

        if (data.pods.length > 0) {
            spinner.succeed();
            data.pods.map(service => {
                const { name, labels: { chart }, namespace, creationTimestamp } = service.objectMeta;
                const groupBy = service.objectMeta.labels[defaultLabel] || "No Label";
                const { podStatus: { status }, restartCount } = service;

                if (!services[groupBy]) {
                    services[groupBy] = [];
                }

                services[groupBy].push({ name, groupBy, status, namespace, chart, creationTimestamp, restartCount, color: colors[status] });
            });

            Object.keys(services).map(groupBy => {
                table.push([{ colSpan: 7, content: chalk.bold(groupBy), hAlign: 'center' }],
                    [{ content: 'name', hAlign: 'center' },
                    { content: 'status', hAlign: 'center' },
                    { content: 'env', hAlign: 'center' },
                    { content: 'chart', hAlign: 'center' },
                    { content: 'created', hAlign: 'center' },
                    { content: 'age', hAlign: 'center' },
                    { content: '↩', hAlign: 'center' }]
                )

                services[groupBy].map(service => {
                    const age = moment(service.creationTimestamp).fromNow();
                    const createdAt = new Date(service.creationTimestamp).toLocaleString();
                    let metaData = [service.name, service.status, service.namespace, service.chart, createdAt, age, service.restartCount];
                    metaData = metaData.map((item, index) => {
                        const coloredItem = chalk.hex(service.color || '#f54029')(item);
                        return index === 0 ? coloredItem : { content: coloredItem, hAlign: 'center' };
                    });

                    table.push(metaData);
                })
            });

            const healthStatuses = data.status;
            // charts
            const { cpu, ram } = createStatisticsCharts(data.cumulativeMetrics, 38, 25);
            // total pod health pie

            const pie = createPie(healthStatuses);
            const groupPie = new Pie(5, [], {
                legend: true,
                no_ansi: false,
                flat: true,
            });
            Object.keys(services).map(groupBy => {
                groupPie.add({ label: groupBy, value: services[groupBy].length });
            });
            table.push([{ colSpan: 7, content: `${chalk.bold('Total Pods Stats')}`, hAlign: 'center' }])
            table.push([
                { content: `${pie.toString()}\n${groupPie.toString()}` },
                { colSpan: 3, content: `Total CPU (millicores)\n\n${cpu.chart}`, hAlign: 'center', vAlign: 'center' },
                { colSpan: 3, content: `Total RAM (MB) \n\n${ram.chart}`, hAlign: 'center', vAlign: 'center' }]);

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