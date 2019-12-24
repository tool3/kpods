const axios = require('axios');
const SockJS = require('sockjs-client');

const execPod = async (argv) => {
    // const url = argv.url;
    const fullUrl = "https://k8s-ui.saas-dev.zerto.com/api/v1/pod/qa/csp-upgrade-view-qa-69fff655cf-pgxc9/shell/csp-upgrade-view"
    const { data } = await axios.get(fullUrl, { headers: { Authorization: `Bearer ${argv.token}` } });
    const sock = new SockJS(`https://k8s-ui.saas-dev.zerto.com/api/sockjs`);

    sock.onopen = (s) => {
        console.log('open');    
        sock.send('ls');
        if (sock.readyState === SockJS.OPEN) {
            sock.send("POST", null, 'ls');
            sock.close()
        }

    };

    sock.onmessage = (e) => {
        console.log('message', e);
        sock.close();
    };

    sock.onerror = (e) => console.error(e);

    sock.onclose = (e) => {
        console.log('closed');
    };
};

module.exports = { execPod }