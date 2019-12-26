const ora = require('ora');
const axios = require('axios');
const Table = require('cli-table3');
const chalk = require('chalk');
const { colors } = require('../constants/colors');
const Pie = require("cli-pie");
const asciiChart = require('chart');

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
                    metaData = metaData.map(item => chalk.hex(service.color || '#ff0000')(item));
                    table.push(metaData);
                })
            });

            const healthStatus = data.status;
            const totalCpu = data.cumulativeMetrics[0].dataPoints;
            const totalRam = data.cumulativeMetrics[1].dataPoints;

            let cpuMetrics = [], cpuTimeStamps = [];
            let ramMetrics = [], ramTimeStamps = [];

            totalCpu.map(point => {
                cpuMetrics.push(point.y);
                cpuTimeStamps.push(new Date(point.x).toLocaleTimeString());
            });

            totalRam.map(point => {
                ramMetrics.push((point.y / 1000 / 1000).toFixed());
                ramTimeStamps.push(new Date(point.timestamp).toLocaleTimeString());
            });


            const cpuChart = asciiChart(cpuMetrics, {
                width: 38,
                height: 15,
                padding: 0,
                pointChar: chalk.greenBright('█'),
                negativePointChar: '░'
            });

            const ramChart = asciiChart(ramMetrics, {
                width: 38,
                height: 15,
                padding: 0,
                pointChar: chalk.blueBright('█'),
                negativePointChar: '░'
            });


            const pie = new Pie(8, [{ label: 'Running', value: healthStatus.running, color: [119, 255, 141] }], {
                legend: true,
                no_ansi: false,
                display_total: true,
                total_label: chalk.bold('Total pods'),
            });

            if (healthStatus.failed) {
                pie.add({
                    label: "Failed"
                    , value: healthStatus.failed,
                    color: [245, 64, 41]
                });
            } else if (healthStatus.pending) {
                pie.add({
                    label: "Pending"
                    , value: healthStatus.pending,
                    color: [255, 165, 0]
                });
            }
            table.push([{ colSpan: 6, content: chalk.bold('Total Pods Stats'), hAlign: 'center' }])
            table.push([{ content: pie.toString() }, { colSpan: 3, content: `Total CPU (millicores) \n\n${cpuChart}`, hAlign: 'center' }, { content: `Total RAM (MB) \n\n${ramChart}`, colSpan: 2, hAlign: 'center' }]);
            console.log(table.toString());


        } else {
            throw `no pods info in env ${argv.env}`
        }

    } catch (e) {
        spinner.fail();
        const err = e.errno || e;
        console.error(chalk.redBright(err));
    }
}

module.exports = { getPods }