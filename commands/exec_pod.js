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
    
    const spinner = ora(`Connecting to ${chalk.bold(argv.name)}`).start();
    const fullName = argv.name.split('-');
    const shortName = fullName.splice(0, fullName.length - 3).join('-');
    const fullUrl = `${argv.url}/${argv.apiVersion}/pod/qa/${argv.name}/shell/${shortName}`;

    const { data } = await axios.get(fullUrl, { headers: { Authorization: `Bearer ${argv.token}` } });

    const time = Date.now();

    sessionId = data.id;
    sock = new SockJS(`https://k8s-ui.saas-dev.zerto.com/api/sockjs?${data.id}`, null, { sessionId: () => data.id });
    spinner.succeed();
    sock.onopen = (s) => {
        const msg = { Op: 'bind', t: time, SessionID: data.id, Data: 'echo hello' };
        sendMessage(sock, msg);
    };

    sock.onmessage = (e) => {
        const { data } = e;
        const value = JSON.parse(data);
        value.Data.includes(argv.name) ? rl.setPrompt(value.Data) : console.log(value.Data);
        rl.prompt();
    };

    sock.onerror = (e) => {
        console.error(e);
    }

    sock.onclose = () => {
        console.log('closing');
        const msg = { Op: 'stdin', SessionID: sessionId, Data: END_OF_TRANSMISSION };
        sendMessage(sock, msg)
        sock.close();
    };

    process.on('SIGINT', () => {
        sock.close();
    });

    process.on('SIGQUIT', () => {
        sock.close();
    });

    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '$ '
    });
    
    rl.on('line', (input) => {
        const msg = { Op: 'stdin', t: time, SessionID: sessionId, Data: `${input}\n` };
        sendMessage(sock, msg);
    });
};

module.exports = { execPod }