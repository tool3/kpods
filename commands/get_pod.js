const ora = require('ora');
const axios = require('axios');
const Table = require('cli-table3');
const chalk = require('chalk');
const moment = require('moment');
const { colors } = require('../constants/colors');
const { createStatisticsCharts, generateGraphTimes } = require('../utils/utils');

const table = new Table({ style: { head: [], border: [] } });

const getPod = async (argv, banner) => {
    process.stdout.write(`${banner}\n`);
    const { token, url, env, name, apiVersion } = argv;
    const suffix = `${apiVersion}/pod/${env}/${name}`;
    const fullUrl = `${url}/${suffix}?Authorization=${token}`
    const spinner = ora(`Getting pod info for ${chalk.bold(name)} in ${chalk.bold(env)}`).start();

    try {
        const { data } = await axios.get(fullUrl, { headers: { Authorization: `Bearer ${token}` } });

        const subsystem = data.objectMeta.labels.subsystem
        const { name, namespace, creationTimestamp, labels: { chart } } = data.objectMeta;
        const { podPhase, restartCount, podIP } = data;
        const { env, image } = data.containers[0];

        const color = colors[podPhase];

        // table columes
        table.push([{ colSpan: 4, content: chalk.bold(name), hAlign: 'center' }],
            [{ content: 'subsystem', hAlign: 'center' }, { content: 'CPU (millicores)', hAlign: 'center' }, { content: 'RAM (MB)', hAlign: 'center' }],
            [{ content: 'status', hAlign: 'center' }, { content: '', rowSpan: 9, vAlign: 'center', hAlign: 'center' }, { content: '', rowSpan: 9, vAlign: 'center', hAlign: 'center' }],
            [{ content: 'env', hAlign: 'center' }],
            [{ content: 'created', hAlign: 'center' }],
            [{ content: 'age', hAlign: 'center' }],
            [{ content: 'restarts', hAlign: 'center' }],
            [{ content: 'image', hAlign: 'center' }],
            [{ content: 'chart', hAlign: 'center' }],
            [{ content: 'IP', hAlign: 'center' }],
            [{ content: 'env vars', hAlign: 'center' }]
        )

        // metrics
        const { cpu, ram } = createStatisticsCharts(data.metrics, 35, 15);

        // env 
        const envVars = env.map(item => `${chalk.bold(item.name)}: ${item.value}`).join('\n');

        // table populate
        table[1].splice(1, 0, subsystem);
        table[2].splice(1, 0, chalk.hex(color)(podPhase));
        table[2][2].content = generateGraphTimes(cpu.chart, cpu.timestamps);
        table[2][3].content = generateGraphTimes(ram.chart, ram.timestamps);
        table[3].push(namespace);
        table[4].push(new Date(creationTimestamp).toLocaleString())
        table[5].push(moment(creationTimestamp).fromNow());
        table[6].push(restartCount);
        table[7].push(image);
        table[8].push(chart);
        table[9].push(podIP);
        table[10].push(envVars);

        spinner.succeed();

        console.log(table.toString());

    } catch (e) {
        spinner.fail();
        const err = e.errno || e;
        console.error(chalk.redBright(err));
    }

}

module.exports = { getPod }