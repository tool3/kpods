
const axios = require('axios');
const ora = require('ora');
const chalk = require('chalk');

const getLogs = async (yargs, banner) => {
    process.stdout.write(`${banner}\n`);
    const args = yargs.argv;
    const namespace = args.env || 'qa';
    const name = args.name;
    const spinner = ora(`Getting pod logs for ${name}`).start();

    const k8s_url = 'https://k8s-ui.saas-dev.zerto.com'
    const suffix = `api/v1/log/${namespace}/${name}`;
    const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJla3MtYWRtaW4tc2Fhcy10b2tlbi1nbW12dCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJla3MtYWRtaW4tc2FhcyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjM1MjUxYWQzLTE0ZjMtMTFlYS05ZmE5LTEyYzMwZDY3ODAxNyIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlLXN5c3RlbTpla3MtYWRtaW4tc2FhcyJ9.biaxbH2lF35HkiwSSUDDcyufIa34mpuV_fKkZ5HNetDpZ82M_Go7LIV4ec9Zrxzv2d2hYNJYEaLFqvQGOd32TfbokbnX7aPoOxywFHzlN7NGLZfdQrSSYLpJ338DVYPLFzqbt5N4X_N3O9-a4VxinhiUEp2OeKBuT9t4WJmeKwtJ88M_4P5uzxl5vO7yGQDG8e-hUJz4Sh0is61K4s1Ih-U12MzCDJFtWB81t69L_rlKPKsH2hosYQK_OLop_3GpSWfGQ1Y7L7jZvg1RdhXv8Vdf_AzaGplWOb0y-hul7nDtJqAi9IQ32i4wyx2CZUQB_EqtBZvfxeS_js9cjqO1aA';
    const url = `${k8s_url}/${suffix}?Authorization=${token}`;
    
    const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    spinner.succeed();
    
    data.logs.map(log => {
        process.stdout.write(`${chalk.bold(new Date(log.timestamp).toLocaleString())} ${log.content}\n`);
    })
    
};

module.exports = { getLogs }