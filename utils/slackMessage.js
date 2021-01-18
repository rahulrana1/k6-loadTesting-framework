const fs = require('fs');

function readSummaryResults() {

    try {
        const report = JSON.parse(fs.readFileSync('./summaryResults.json').toString());
        const arr_errors = getRequiredKeys(report, 'errors')
        const arr_responseTimes = getRequiredKeys(report, 'http_req_duration')
        const maxVirtualUsers = report.metrics.vus.max

        const objResults = {
            errors: arr_errors,
            responseTimes: arr_responseTimes,
            maxVirtualUsers: maxVirtualUsers
        }
        return objResults
    }
    catch (err) {
        report = "Not Found"
        console.log(err)
        console.log("rails/nodejs json files ", report)
        return report
    }
}

function getRequiredKeys(report, matchingText) {
    const regex = new RegExp(`${matchingText}{.*}$`, 'g')
    const errorKeys = Object.keys(report.metrics).reduce((acc, r) => {
        if (r.match(regex)) {
            acc[r] = report.metrics[r]
        }
        return acc
    }, [])

    return errorKeys;
}

async function writeLoadTestResultsToTxtFile() {
    const res = readSummaryResults()
    const resultsFilePath = './resultsForSlack.txt'
    const resultsTxtFormat = getResultsTxtFormat(res)

    if (res === 'Not Found') {
        return fs.writeFile(resultsFilePath, 'test results not found! Please check the console logs to find more info.', (error) => {
            if (error) throw error;
        });
    }

    fs.writeFile(resultsFilePath, resultsTxtFormat, (error) => {
        if (error) throw error;
    });
}

function getResultsTxtFormat(res) {
    let strResults = ''
    let scenarioName = ''
    const errors = res.errors
    const responseTimes = res.responseTimes

    for (let error in errors) {
        let name = error.split("scenario:")[1]
        scenarioName = name.slice(0, -1)

        let errorCount = getErrorCountPerTest(error, errors)
        let perfStats = getPerfStatsPerTest(responseTimes, scenarioName)

        strResults = `*${scenarioName}* : \n Errors : ${errorCount} \n P(90) res time : ${perfStats.p90responseTime} (s) \n P(95) res time : ${perfStats.p95responseTime} (s) \n Thresholds : ${perfStats.threshold} (ms) \n \n${strResults}`
    }

    let result = `*Max virtual user*: ${res.maxVirtualUsers} \n \n${strResults}`
    return result
}

function getErrorCountPerTest(error, errors) {
    let name = error.split("scenario:")[1]
    scenarioName = name.slice(0, -1)
    let errorCount = `${errors[error].fails}/ ${errors[error].passes}`
    return errorCount
}

function getPerfStatsPerTest(responseTimes, scenarioName) {
    let p90responseTime, p95responseTime

    for (let responseTime in responseTimes) {
        if (responseTime.includes(scenarioName)) {
            p90responseTime = (responseTimes[responseTime]['p(90)'] / 1000).toFixed(2)
            p95responseTime = (responseTimes[responseTime]['p(95)'] / 1000).toFixed(2)
            threshold = Object.keys(responseTimes[responseTime].thresholds)
        }
    }

    let perfStats = {
        p90responseTime: p90responseTime,
        p95responseTime: p95responseTime,
        threshold: threshold
    }

    return perfStats
}

writeLoadTestResultsToTxtFile()