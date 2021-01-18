import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
import { getPostmanEnvValue } from "../../utils/readPostmanEnvVar.js";
import { getEnvName } from "../../utils/getEnv.js";
const env = getEnvName()

export let errorRate = new Rate('errors');

const testdata = JSON.parse(open(`../../postman/envVariables/${env}-env-variables.environment.json`));
const baseUrl = getPostmanEnvValue(testdata, 'appURL')
const session_cookie = getPostmanEnvValue(testdata, 'nexthub_ui_session')

export function api1 () {

    const url = `https://${baseUrl}/v1/api1`

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': session_cookie
        },
    };

    let res = http.get(url, params);

    const result = check(res, {
        'v1/api is status 200': (r) => r.status === 200,
    });

    errorRate.add(result);
}
