#!/bin/bash

set -eo pipefail

function target_build_docker_image() {
    docker build -t loadtestk6 -f Docker/dockerfile .
}

function target_docker_run_nodejs_loadtest() {
    docker run -i -e ENVIRONMENT -e K6_CONTAINER_NAME -e INFLUXDB_URL --name "$K6_CONTAINER_NAME" loadtestk6 ./shellScripts/runLoadTest.sh
}

function target_local_storeAdvisorCookies() {
    node -r esm postman/scripts/login.js
}

function target_local_run_nodejs_test() {
    k6 run -e ENVIRONMENT -e INFLUXDB_URL --summary-export=results/summaryResults.json --out influxdb="$INFLUXDB_URL" scenarios/api.scenario.js
}

function setEnvVariables() {
    input=".env"
    while IFS= read -r line; do
        arrIN=(${line//=/ })
        export ${arrIN[0]}=${arrIN[1]}
    done <"$input"
}

if type -t "target_$1" &>/dev/null; then
    setEnvVariables
    target_$1 ${@:2}
else
    echo "usage: $0 <target>
target:
    build_docker_image                          --      Builds docker image for k6-loadtests
    docker_run_nodejs_loadtest                  --      Runs nodejs load tests in docker
    local_storeAdvisorCookies                   --      creates and stores cookies for advisor login in newman env variable files
    local_run_nodejs_test                       --      Runs nodejs load tests locally
"
    exit 1
fi