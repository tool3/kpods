const ora = require('ora');
const axios = require('axios');
const Table = require('cli-table3');
const chalk = require('chalk');
const _ = require('lodash');

const table = new Table({ style: { head: [], border: [] } });
const services = {};
const colors = { 'Running': '#77FF8D', 'Error': '#ff0000', 'Creating': '#ffa500' };

const getPods = async (yargs, banner) => {
    process.stdout.write(`${banner}\n`);
    const args = yargs.argv;
    const namespace = args.env || 'qa';
    const k8s_url = 'https://k8s-ui.saas-dev.zerto.com'
    const suffix = `api/v1/pod/${namespace}`;
    const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJla3MtYWRtaW4tc2Fhcy10b2tlbi1nbW12dCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJla3MtYWRtaW4tc2FhcyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjM1MjUxYWQzLTE0ZjMtMTFlYS05ZmE5LTEyYzMwZDY3ODAxNyIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlLXN5c3RlbTpla3MtYWRtaW4tc2FhcyJ9.biaxbH2lF35HkiwSSUDDcyufIa34mpuV_fKkZ5HNetDpZ82M_Go7LIV4ec9Zrxzv2d2hYNJYEaLFqvQGOd32TfbokbnX7aPoOxywFHzlN7NGLZfdQrSSYLpJ338DVYPLFzqbt5N4X_N3O9-a4VxinhiUEp2OeKBuT9t4WJmeKwtJ88M_4P5uzxl5vO7yGQDG8e-hUJz4Sh0is61K4s1Ih-U12MzCDJFtWB81t69L_rlKPKsH2hosYQK_OLop_3GpSWfGQ1Y7L7jZvg1RdhXv8Vdf_AzaGplWOb0y-hul7nDtJqAi9IQ32i4wyx2CZUQB_EqtBZvfxeS_js9cjqO1aA';

    const spinner = ora('Getting pods').start();

    try {
        const { data } = await axios.get(`${k8s_url}/${suffix}?Authorization=${token}`, { headers: { Authorization: `Bearer ${token}` } });

        if (data.pods.length > 0) {
            spinner.succeed();
            data.pods.map(service => {
                const { name, labels: { subsystem }, namespace, creationTimestamp } = service.objectMeta;
                const { podStatus: { status }, restartCount } = service;

                if (!services[subsystem]) {
                    services[subsystem] = [];
                }

                services[subsystem].push({ name, subsystem, status, namespace, creationTimestamp, restartCount, color: colors[status] });
            });

            Object.keys(services).map(subsystem => {

                table.push([{ colSpan: 5, content: chalk.bold(subsystem), hAlign: 'center' }],
                    [{ content: 'name', hAlign: 'center' },
                    { content: 'status', hAlign: 'center' },
                    { content: 'env', hAlign: 'center' },
                    { content: 'created', hAlign: 'center' },
                    { content: '↩' }])

                services[subsystem].map(service => {
                    let metaData = [service.name, service.status, service.namespace, new Date(service.creationTimestamp).toLocaleString(), service.restartCount];
                    metaData = metaData.map(item => chalk.hex(service.color || '#ff0000')(item));
                    table.push(metaData);
                })
            });

            console.log(table.toString());
        } else {
            throw `no pods in env ${args.env}`
        }

    } catch (e) {
        spinner.stop();
        const err = e.errno || e;
        console.error(chalk.redBright(err));
    };
}

module.exports = { getPods }