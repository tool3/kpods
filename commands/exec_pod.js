const axios = require('axios');
const SockJS = require('sockjs-client');
const readline = require('readline');
const ora = require('ora');
const chalk = require('chalk');

let sessionId = '';
let sock, rl;
const END_OF_TRANSMISSION = "\u0004"

const sendMessage = (sock, message) => {
    const msg = JSON.stringify(message);
    sock.send(msg);
}

const execPod = async (argv, banner) => {
    process.stdout.write(`${banner}\n`);
    let cursor = `root@${argv.name}:`;
    const spinner = ora(`Connecting to ${chalk.bold(argv.name)}`).start();
    const fullName = argv.name.split('-');
    const shortName = fullName.splice(0, fullName.length - 3).join('-');
    const fullUrl = `${argv.url}/${argv.apiVersion}/pod/qa/${argv.name}/shell/${shortName}`;
    const { data } = await axios.get(fullUrl, { headers: { Authorization: `Bearer ${argv.token}` } });
    sessionId = data.id;
    sock = new SockJS(`https://k8s-ui.saas-dev.zerto.com/api/sockjs?${data.id}`, null, { sessionId: () => data.id });

    const time = Date.now();
    spinner.succeed();

    sock.onopen = () => {
        const msg = { Op: 'bind', t: time, SessionID: data.id, Data: '' };
        sendMessage(sock, msg);
        rl.setPrompt(cursor);
    };

    sock.onmessage = (e) => {
        const { data } = e;
        let value = JSON.parse(data);
        
        if (value.Data.includes(cursor)) {
            rl.setPrompt(value.Data.replace(cursor, `${chalk.bold(cursor)}`));
            return rl.prompt();
        }
        
        console.log(`${value.Data}`);
    };

    sock.onerror = (e) => {
        console.error(e);
    }

    sock.onclose = () => {
        console.log('closing');
        const msg = { Op: 'stdin', SessionID: sessionId, Data: END_OF_TRANSMISSION };
        sendMessage(sock, msg)
        sock.close();
        process.exit(0);
    };

    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk.white('🚀  Shell connecting...')
    });

    rl.on('SIGINT', () => {
        sock.close();
    });

    rl.on('SIGQUIT', () => {
        sock.close();
    });

    rl.on('line', (input) => {
        if (sock.readyState !== SockJS.OPEN) {
            console.log(chalk.redBright('🔄  Still connecting...'));
        }
        if (sock.readyState === SockJS.OPEN) {
            const msg = { Op: 'stdin', t: time, SessionID: sessionId, Data: `${input}\n` };
            sendMessage(sock, msg);
        }

    });

    rl.prompt();
};

module.exports = { execPod }