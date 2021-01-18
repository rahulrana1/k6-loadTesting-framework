npm run login
k6 run --summary-export=summaryResults.json --out influxdb="$INFLUXDB_URL" scenarios/api.scenario.js
node utils/slackMessage.js
