const axios = require('axios');
const SockJS = require('sockjs-client');

const execPod = async (argv) => {
    // const url = argv.url;
    const fullUrl = "https://k8s-ui.saas-dev.zerto.com/api/v1/pod/qa/backoffice-qa-fbbb866-5gdkn/shell/backoffice-qa"
    const { data } = await axios.get(fullUrl, { headers: { Authorization: `Bearer ${argv.token}` } });
    const time = Date.now();
    const sock = new SockJS(`https://k8s-ui.saas-dev.zerto.com/api/sockjs?${data.id}&t=${time}`); 

    sock.onopen = (s) => {
        console.log('Connection Opened');
        const msg = { t: time, id: data.id }
        const message = JSON.stringify(msg);
        sock.send(message);
    };

    sock.onmessage = (e) => {
        console.log('message', e);
        sock.close();
    };

    sock.onerror = (e) => console.error(e);

    sock.onclose = (e) => {
        console.log('closed');
    };

    process.on('SIGINT', () => sock.close());
};

module.exports = { execPod }