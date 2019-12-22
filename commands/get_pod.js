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
        // const mockData = {"objectMeta":{"name":"zca-scripts-upgrade-consumer-qa-d5d5bbf7-8bsm7","namespace":"qa","labels":{"app":"zca-scripts-upgrade-consumer","bg":"zca-scripts-upgrade-consumer-qa","chart":"1.0.9","color":"qa","pod-template-hash":"d5d5bbf7","subsystem":"zca-scripts-upgrade","version":"38"},"annotations":{"kubernetes.io/psp":"eks.privileged"},"creationTimestamp":"2019-12-08T09:19:45Z","uid":"dfab05a5-199b-11ea-9fa9-12c30d678017"},"typeMeta":{"kind":"pod"},"podPhase":"Running","podIP":"10.180.10.184","nodeName":"ip-10-180-9-9.ec2.internal","restartCount":0,"qosClass":"BestEffort","controller":{"objectMeta":{"name":"zca-scripts-upgrade-consumer-qa-d5d5bbf7","namespace":"qa","labels":{"app":"zca-scripts-upgrade-consumer","bg":"zca-scripts-upgrade-consumer-qa","chart":"1.0.9","color":"qa","pod-template-hash":"d5d5bbf7","subsystem":"zca-scripts-upgrade","version":"38"},"annotations":{"deployment.kubernetes.io/desired-replicas":"1","deployment.kubernetes.io/max-replicas":"1","deployment.kubernetes.io/revision":"20","deployment.kubernetes.io/revision-history":"2,4,6,8,10,12,14,16,18"},"creationTimestamp":"2019-11-28T09:02:03Z","uid":"bed5e72a-11bd-11ea-9fa9-12c30d678017"},"typeMeta":{"kind":"replicaset","scalable":true},"pods":{"current":1,"desired":1,"running":1,"pending":0,"failed":0,"succeeded":0,"warnings":[]},"containerImages":["689106383337.dkr.ecr.us-east-1.amazonaws.com/zca-scripts-upgrade-consumer:38"],"initContainerImages":null},"containers":[{"name":"zca-scripts-upgrade-consumer","image":"689106383337.dkr.ecr.us-east-1.amazonaws.com/zca-scripts-upgrade-consumer:38","env":[{"name":"ENV_NAME","value":"zca-scripts-upgrade-consumer","valueFrom":null},{"name":"IZERTO_ENV","value":"qa_k8s","valueFrom":null},{"name":"KAFKA_SITE_TOPIC","value":"site","valueFrom":null},{"name":"KAFKA_SCRIPTS_TOPIC","value":"pc-installed-components","valueFrom":null},{"name":"MESSAGE_SITES_SERVICE_END_PNT","value":"http://messages-for-sites-qa-int","valueFrom":null},{"name":"ACCESS_KEY_ID","value":"QUtJQUpYVkw2UjJHTE5XSlhVVVE=","valueFrom":{"secretKeyRef":{"name":"global-secrets","key":"s3_access_key_id"}}},{"name":"SECRET_ACCESS_KEY","value":"aEloRHZienVidnRROVZlWElZQnRQSGtiTm0xczVrb1pxdkJXbXpKMw==","valueFrom":{"secretKeyRef":{"name":"global-secrets","key":"s3_secret_access_key"}}},{"name":"IZERTO_NODE_CONFIG_DIR","value":"TRUE","valueFrom":{"configMapKeyRef":{"name":"global-configmap-zca-scripts-upgrade-qa","key":"IZERTO_NODE_CONFIG_DIR"}}}],"commands":null,"args":null}],"initContainers":[],"metrics":[{"dataPoints":[{"x":1577021749,"y":92},{"x":1577021809,"y":92},{"x":1577021869,"y":97},{"x":1577021929,"y":109},{"x":1577021989,"y":97},{"x":1577022049,"y":105},{"x":1577022109,"y":108},{"x":1577022169,"y":95},{"x":1577022229,"y":101},{"x":1577022289,"y":91},{"x":1577022349,"y":91},{"x":1577022409,"y":83},{"x":1577022469,"y":106},{"x":1577022529,"y":84},{"x":1577022589,"y":99}],"metricPoints":[{"timestamp":"2019-12-22T13:35:49Z","value":92},{"timestamp":"2019-12-22T13:36:49Z","value":92},{"timestamp":"2019-12-22T13:37:49Z","value":97},{"timestamp":"2019-12-22T13:38:49Z","value":109},{"timestamp":"2019-12-22T13:39:49Z","value":97},{"timestamp":"2019-12-22T13:40:49Z","value":105},{"timestamp":"2019-12-22T13:41:49Z","value":108},{"timestamp":"2019-12-22T13:42:49Z","value":95},{"timestamp":"2019-12-22T13:43:49Z","value":101},{"timestamp":"2019-12-22T13:44:49Z","value":91},{"timestamp":"2019-12-22T13:45:49Z","value":91},{"timestamp":"2019-12-22T13:46:49Z","value":83},{"timestamp":"2019-12-22T13:47:49Z","value":106},{"timestamp":"2019-12-22T13:48:49Z","value":84},{"timestamp":"2019-12-22T13:49:49Z","value":99}],"metricName":"cpu/usage_rate","aggregation":"sum"},{"dataPoints":[{"x":1577021749,"y":188813312},{"x":1577021809,"y":190234624},{"x":1577021869,"y":189870080},{"x":1577021929,"y":188760064},{"x":1577021989,"y":188985344},{"x":1577022049,"y":189620224},{"x":1577022109,"y":188829696},{"x":1577022169,"y":188485632},{"x":1577022229,"y":190676992},{"x":1577022289,"y":191025152},{"x":1577022349,"y":188665856},{"x":1577022409,"y":190398464},{"x":1577022469,"y":188702720},{"x":1577022529,"y":190967808},{"x":1577022589,"y":192073728}],"metricPoints":[{"timestamp":"2019-12-22T13:35:49Z","value":188813312},{"timestamp":"2019-12-22T13:36:49Z","value":190234624},{"timestamp":"2019-12-22T13:37:49Z","value":189870080},{"timestamp":"2019-12-22T13:38:49Z","value":188760064},{"timestamp":"2019-12-22T13:39:49Z","value":188985344},{"timestamp":"2019-12-22T13:40:49Z","value":189620224},{"timestamp":"2019-12-22T13:41:49Z","value":188829696},{"timestamp":"2019-12-22T13:42:49Z","value":188485632},{"timestamp":"2019-12-22T13:43:49Z","value":190676992},{"timestamp":"2019-12-22T13:44:49Z","value":191025152},{"timestamp":"2019-12-22T13:45:49Z","value":188665856},{"timestamp":"2019-12-22T13:46:49Z","value":190398464},{"timestamp":"2019-12-22T13:47:49Z","value":188702720},{"timestamp":"2019-12-22T13:48:49Z","value":190967808},{"timestamp":"2019-12-22T13:49:49Z","value":192073728}],"metricName":"memory/usage","aggregation":"sum"}],"conditions":[{"type":"Initialized","status":"True","lastProbeTime":null,"lastTransitionTime":"2019-12-08T09:19:45Z","reason":"","message":""},{"type":"Ready","status":"True","lastProbeTime":null,"lastTransitionTime":"2019-12-08T09:20:31Z","reason":"","message":""},{"type":"ContainersReady","status":"True","lastProbeTime":null,"lastTransitionTime":"2019-12-08T09:20:31Z","reason":"","message":""},{"type":"PodScheduled","status":"True","lastProbeTime":null,"lastTransitionTime":"2019-12-08T09:19:45Z","reason":"","message":""}],"eventList":{"listMeta":{"totalItems":0},"events":[],"errors":[]},"persistentVolumeClaimList":{"listMeta":{"totalItems":0},"items":null,"errors":null},"errors":[]};
        // const data = mockData;
        const subsystem = data.objectMeta.labels.subsystem
        const { name, namespace, creationTimestamp } = data.objectMeta;
        const { podPhase, restartCount } = data;
        const { env, image } = data.containers[0];

        const color = colors[podPhase];


        table.push([{ colSpan: 4, content: chalk.bold(name), hAlign: 'center' }],
            [{ content: 'subsystem', hAlign: 'center' }],
            [{ content: 'status', hAlign: 'center' }],
            [{ content: 'env', hAlign: 'center' }],
            [{ content: 'created', hAlign: 'center' }],
            [{ content: 'restarts', hAlign: 'center' }],
            [{ content: 'env vars', hAlign: 'center' }],
            [{ content: 'image', hAlign: 'center' }],
            // [{ content: 'CPU (millicores)', hAlign: 'center' }],
            // [{ content: 'RAM (MB)', hAlign: 'center' }]
        )

        // metrics
        const cpu = data.metrics[0];
        const ram = data.metrics[1];

        const cpuData = cpu.metricPoints.map(point => point.value);
        const ramData = ram.metricPoints.map(point => point.value);

        const cpuAsc = asciichart.plot(cpuData, {
            height: 10, width: 140, padding: 0, format(val) {
                val = (val).toFixed();
                return val.length >= 2 ? val : `0${val}`
            }
        });
        const ramAsc = asciichart.plot(ramData, {
            height: 10, width: 140, padding: 0, format(val) {
                val = (val / 1000 / 1000).toFixed();
                return val.length >= 2 ? val : `0${val}`
            }
        });

        // env 
        const envVars = env.map(item => `${chalk.bold(item.name)}: ${item.value}`).join('\n');

        let metaData = [subsystem, podPhase, namespace, new Date(creationTimestamp).toLocaleString(), restartCount, "", "", cpuAsc, ramAsc];
        metaData = metaData.map(item => chalk.hex(color || '#ff0000')(item));
        // table.push(metaData);
        table[1].splice(1, 0, subsystem)
        table[1].push({ content: `${chalk.underline('CPU (millicores)')}\n\n${cpuAsc}`, hAlign: 'center', rowSpan: 7 }, { content: `${chalk.underline('RAM (MB)')}\n\n${ramAsc}`, hAlign: 'center', rowSpan: 7 })
        table[2].push(chalk.hex(color)(podPhase))
        table[3].push(namespace)
        table[4].push(new Date(creationTimestamp).toLocaleString())
        table[5].push(restartCount)
        table[6].push(envVars)
        table[7].push(image)

        spinner.succeed();
        console.log(table.toString());

    } catch (e) {
        spinner.fail();
        const err = e.errno || e;
        console.error(chalk.redBright(err));
    }

}

module.exports = { getPod }