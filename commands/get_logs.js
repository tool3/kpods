
const axios = require('axios');
const ora = require('ora');
const chalk = require('chalk');

const getLogs = async (argv, banner) => {
    process.stdout.write(`${banner}\n`);
    const { token, url, env, name, apiVersion } = argv;
    const suffix = `${apiVersion}/log/${env}/${name}`;
    const fullUrl = `${url}/${suffix}?Authorization=${token}`;

    const spinner = ora(`Getting logs for ${chalk.bold(name)} in ${chalk.bold(env)}`).start();
    try {
        const { data } = await axios.get(fullUrl, { headers: { Authorization: `Bearer ${token}` } });
        spinner.succeed();

        data.logs.map(log => {
            process.stdout.write(`${chalk.bold.underline(new Date(log.timestamp).toLocaleString())} ${log.content}\n`);
        })
    } catch (error) {
        spinner.fail();
        const err = e.errno || e;
        console.error(chalk.redBright(err));
    }


};

module.exports = { getLogs }