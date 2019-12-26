const generateGraphTimes = (chart, times) => {
    return `\n${chart}\n\n   From ${chalk.bold(times[0])} to ${chalk.bold(times[times.length - 1])}`
}

