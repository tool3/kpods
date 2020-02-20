const chalk = require('chalk');
const Pie = require("cli-pie");
const asciiChart = require("chart");
const { colors } = require('../constants/colors');

const createPie = (healthStatuses) => {
    
    const pie = new Pie(8, [{ label: chalk.hex(colors['Running'])('Running'), value: healthStatuses.running, color: [119, 255, 141] }], {
        legend: true,
        no_ansi: false,
        display_total: true,
        flat: true,
        total_label: chalk.bold('Total pods'),
    });

    if (healthStatuses.failed) {
        pie.add({
            label: chalk.redBright("Failed"),
            value: healthStatuses.failed,
            color: [245, 64, 41]
        });
    }

    if (healthStatuses.pending) {
        pie.add({
            label: chalk.hex(colors['Pending'])('Pending'),
            value: healthStatuses.pending,
            color: [255, 165, 0]
        });
    }

    return pie;
}

const createStatisticsCharts = (cumulativeMetrics, width, height) => {
    const totalCpu = cumulativeMetrics[0].dataPoints;
    const totalRam = cumulativeMetrics[1].dataPoints;

    let cpuMetrics = [], cpuTimeStamps = [];
    let ramMetrics = [], ramTimeStamps = [];

    totalCpu.map(point => {
        cpuMetrics.push(point.y);
        cpuTimeStamps.push(new Date(point.x * 1000).toLocaleTimeString());
    });

    totalRam.map(point => {
        ramMetrics.push((point.y / 1000 / 1000).toFixed());
        ramTimeStamps.push(new Date(point.x * 1000).toLocaleTimeString());
    });


    const cpuChart = asciiChart(cpuMetrics, {
        width: width,
        height: height,
        padding: 0,
        pointChar: chalk.hex(colors['Running'])('█'),
        negativePointChar: '░'
    });

    const ramChart = asciiChart(ramMetrics, {
        width: width,
        height: height,
        padding: 0,
        pointChar: chalk.blueBright('█'),
        negativePointChar: '░'
    });

    return {
        ram: { chart: ramTimeStamps.length > 0 ? ramChart : "N/A", timestamps: ramTimeStamps }, cpu: { chart: cpuTimeStamps.length > 0 ? cpuChart : "N/A", timestamps: cpuTimeStamps }
    };
}

const generateGraphTimes = (chart, times) => {
    return `\n${chart}\n\n   ${displayTimeRange(times)}`
}

const displayTimeRange = (times) => {
    return times.length > 0  ? `(${times[0]} to ${times[times.length - 1]})` : '';
}

module.exports = { createPie, createStatisticsCharts, generateGraphTimes, displayTimeRange }