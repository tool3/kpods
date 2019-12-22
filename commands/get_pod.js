const ora = require('ora');
const axios = require('axios');
const Table = require('cli-table3');
const chalk = require('chalk');

const getPod = async (argv, banner) => {
    process.stdout.write(`${banner}\n`);
    const { token, url, env, name, apiVersion } = argv;
    const suffix = `${apiVersion}/pod/${env}/${name}`;
    const fullUrl = `${url}/${suffix}?Authorization=${token}`
    const spinner = ora(`Getting pod info for ${chalk.bold(name)} in ${chalk.bold(env)}`).start();

    try {
        const { data } = await axios.get(fullUrl, { headers: { Authorization: `Bearer ${token}` } });
        spinner.succeed();
        console.log(data);
        // build pod info

    } catch (e) {
        spinner.fail();
        const err = e.errno || e;
        console.error(chalk.redBright(err));
    }

}

module.exports = { getPod }