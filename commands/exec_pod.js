const SockJS = require('sockjs-client');
const readline = require('readline');
const ora = require('ora');
const chalk = require('chalk');
const { getRequest } = require('../utils/requestUtils');

let sock;
const END_OF_TRANSMISSION = "\u0004"

const sendMessage = (sock, message) => {
    const msg = JSON.stringify(message);
    sock.send(msg);
}

const execPod = async (argv, banner) => {
    let cursor = `root@${argv.name}`;

    const rl = readline.createInterface({
        terminal: true,
        input: process.stdin,
        output: process.stdout
    });

    process.stdout.write(`${banner}\n`);
    const spinner = ora({ text: `Connecting to ${chalk.bold(argv.name)}`, discardStdin: false, stream: rl.output }).start();
    const fullName = argv.name.split('-');
    const shortName = fullName.splice(0, fullName.length - 3).join('-');

    const fullUrl = `${argv.url}/${argv.apiVersion}/pod/qa/${argv.name}/shell/${shortName}`;
    const { data } = await getRequest(fullUrl, token);
    const sessionId = data.id;

    sock = new SockJS(`${argv.url}/api/sockjs?${data.id}`, null, { sessionId: () => data.id });

    const time = Date.now();

    sock.onopen = () => {
        const msg = { Op: 'bind', t: time, SessionID: data.id, Data: '' };
        sendMessage(sock, msg);
    };

    sock.onmessage = (e) => {
        if (spinner.isSpinning) {
            spinner.succeed()
        }
        const { data } = e;
        let value = JSON.parse(data);

        // set cursor
        if (value.Data.includes(cursor)) {
            const boldName = chalk.bold(argv.name);
            const cursorMaxLength = 80;
            let prompt = `${value.Data.replace(argv.name, boldName)}`;
            if (value.Data.length >= cursorMaxLength) {
                const currentPath = prompt.split('/').splice(-1);
                prompt = `${boldName}:../${currentPath}: `;
                }

            rl.setPrompt(prompt.trim());
            return rl.prompt(true);
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
};

module.exports = { execPod }