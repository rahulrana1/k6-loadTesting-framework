import http from "k6/http";
import { api1 } from '../tests/serviceName/GET_api1.test.js'
import { api2 } from '../tests/serviceName/GET_api2.test.js'

export let options = {
    scenarios: {
        api1: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '6s', target: 10 },
                { duration: '30s', target: 10 },
            ],
            gracefulRampDown: '6s',
            exec: 'test_api1'
        },
        api2: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '6s', target: 10 },
                { duration: '30s', target: 10 },
            ],
            gracefulRampDown: '6s',
            exec: 'test_api2'
        }
    },
    thresholds: {
        /* we can set different thresholds for the different scenarios because
        of the extra metric tags we set!*/
        'http_req_duration{scenario:api1}': ['p(95)<15000'],
        'errors{scenario:api1}': ['rate>0.5'],

        'http_req_duration{scenario:api2}': ['p(95)<12000'],
        'errors{scenario:api2}': ['rate>0.5'],
    },
}

export function test_api1 () {
    api1();
}

export function test_api2() {
    api2();
}