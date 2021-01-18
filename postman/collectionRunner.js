const newman = require('newman');
const expect = require('expect.js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const environment = process.env.ENVIRONMENT.toLowerCase()

class postmanRunner {

    async loginWithPostman() {
        const folder = ['login']
        const objConfig = config(folder, 'resultFileName')
        return new Promise((resolve, reject) => {
            newman.run({
                ...objConfig,
                exportEnvironment: `postman/envVariables/${environment}-env-variables.environment.json`
            }, function (err, summary) {
                if (err) {
                    console.log(err)
                }
                resolve(summary)
            });
        })
    }
}


function getEnvironmentFile() {
    const environment = (process.env.ENVIRONMENT).toUpperCase();
    let environmentFile;
    switch (environment) {
        case 'UAT':
            environmentFile = `postman/envVariables/uat-env-variables.environment.json`;
            return environmentFile;

        case 'TEST':
            environmentFile = `postman/envVariables/test-env-variables.environment.json`;
            return environmentFile;

        case 'PROD':
            environmentFile = `postman/envVariables/prod-env-variables.environment.json`;
            return environmentFile;

        default:
            throw new Error("enter valid ENVIRONMENT in .env file. UAT, TEST and PROD are the only permitted values ");
    }
}

function config(arrFolder, resultsName) {
    const envFile = getEnvironmentFile()
    const runobj = {
        collection: 'postman/collections/collectionName.collection.json',
        timeout: 0,
        folder: arrFolder,
        environment: envFile,
        reporters: ['htmlextra', 'cli'],
        reporter: {
            htmlextra: {
                export: 'postmanResults/' + resultsName + '.html'
            }
        },
        ignoreRedirects: true,
        color: "on"
    }

    return runobj;
}


export default new postmanRunner();