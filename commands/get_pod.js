const ora = require('ora');
const axios = require('axios');
const Table = require('cli-table3');
const chalk = require('chalk');
const { colors } = require('../constants/colors');
const asciichart = require('asciichart');

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
            [{ content: 'subsystem', hAlign: 'center' }],
            [{ content: 'status', hAlign: 'center' }],
            [{ content: 'env', hAlign: 'center' }],
            [{ content: 'created', hAlign: 'center' }],
            [{ content: 'restarts', hAlign: 'center' }],
            [{ content: 'image', hAlign: 'center' }],
            [{ content: 'chart', hAlign: 'center' }],
            [{ content: 'IP', hAlign: 'center' }],
            [{ content: 'env vars', hAlign: 'center' }]
        )

        // metrics
        const cpu = data.metrics[0];
        const ram = data.metrics[1];

        const cpuData = cpu.metricPoints.map(point => point.value);
        const ramData = ram.metricPoints.map(point => point.value);

        const cpuAsc = asciichart.plot(cpuData, {
            height: 10, width: 150, padding: 0, format(val) {
                val = (val).toFixed();
                return val.length >= 2 ? chalk.dim(`${val}`) : chalk.dim(`0${val}`)
            }
        });
        const ramAsc = asciichart.plot(ramData, {
            height: 10, width: 150, padding: 0, format(val) {
                val = (val / 1000 / 1000).toFixed();
                return val.length >= 2 ? chalk.dim(`${val}`) : chalk.dim(`0${val}`)
            }
        });

        // env 
        const envVars = env.map(item => `${chalk.bold(item.name)}: ${item.value}`).join('\n');

        // table populate
        table[1].splice(1, 0, subsystem)
        table[1].push({ content: `${chalk.underline('CPU (millicores)')}\n\n${cpuAsc}`, hAlign: 'center', rowSpan: 9 }, { content: `${chalk.underline('RAM (MB)')}\n\n${ramAsc}`, hAlign: 'center', rowSpan: 9 })
        table[2].push(chalk.hex(color)(podPhase))
        table[3].push(namespace)
        table[4].push(new Date(creationTimestamp).toLocaleString())
        table[5].push(restartCount)
        table[6].push(image)
        table[7].push(chart)
        table[8].push(podIP)
        table[9].push(envVars)

        spinner.succeed();
        console.log(table.toString());

    } catch (e) {
        spinner.fail();
        const err = e.errno || e;
        console.error(chalk.redBright(err));
    }

}

module.exports = { getPod }