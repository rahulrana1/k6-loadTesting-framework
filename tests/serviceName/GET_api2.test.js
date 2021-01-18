import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
import { getPostmanEnvValue } from "../../utils/readPostmanEnvVar.js";
import { buildQueryParams } from "../../utils/queryParamsBuilder.js";
import { getEnvName } from "../../utils/getEnv.js";
const env = getEnvName()

export let errorRate = new Rate('errors');

const testdata = JSON.parse(open(`../../postman/envVariables/${env}-env-variables.environment.json`));
const baseUrl = getPostmanEnvValue(testdata, 'baseURL')
const param1 = getPostmanEnvValue(testdata, 'param1')
const session_cookie = getPostmanEnvValue(testdata, 'session_cookie')

export function api2() {

    let urlQuery = buildQueryParams({
        paramName: param1
    });

    const url = `https://${baseUrl}/v1/api2?${urlQuery}`

    let params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': session_cookie
        }
    };

    let res = http.get(url, params);

    const result = check(res, {
        'v1/api2 is status 200': (r) => r.status === 200,
    });

    errorRate.add(result);
}
