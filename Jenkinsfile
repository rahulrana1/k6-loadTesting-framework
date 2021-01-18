pipeline {
    agent any
    environment {
        ENVIRONMENT = getEnv_var()
        K6_CONTAINER_NAME = getContainerName("k6")
        INFLUXDB_URL = 'http://ipOfInfluxDB:8086/databaseName'
    }

    stages {
        stage('👷 Build Image') {
            steps{
                sh './go build_docker_image'
            }
        }

        stage('K6 Performance Testing') {
            steps {
                echo 'Running K6 performance tests...'
                sh './go docker_run_nodejs_loadtest'
                echo 'Completed Running K6 performance tests!'
            }

            post{
                always {
                    copyResultsFromRootDocker('summaryResults.json')
                    copyResultsFromRootDocker('resultsForSlack.txt')
                    archiveResults('summaryResults.json')
                }
            }
        }

        stage('Send Results To Slack') {
            //when { expression { params.SEND_SLACK_MESSAGE.toBoolean() } }
            steps{
                slack currentBuild
            }
        }
    }
}

def getContainerName(type) {
    def name = env.JOB_NAME
    def date = new Date()
    def timeInMillsecs = date.getTime()
    return name + "_" + type + "_" + timeInMillsecs
}

def archiveResults(path){
    script {
        archiveArtifacts([
            artifacts: path,
            followSymlinks: false,
            allowEmptyArchive: true
        ])
    }
}

def copyResultsFromRootDocker(fileName){

    sh """
        cont=\$(docker ps -aqf "name="$K6_CONTAINER_NAME"")
        docker cp \$cont:/app/${fileName} ${fileName}
    """
}

//summaryResults.json

def getEnv_var() {
    def name = env.JOB_NAME

    if(name.contains('UAT')){
        return "UAT";
    }

    if(name.contains('TEST')){
        return "TEST";
    }

    if(name.contains('PROD')){
        return "PROD";
    }
}

def slack(currentBuild) {
    def colour = currentBuild.result == 'SUCCESS' ? 'good' : 'danger'
    def msgSlack = readFile "./resultsForSlack.txt"

    echo "k6 Report message ${msgSlack}"

    def finalMessage = "*K6 Load Test Results in ${env.ENVIRONMENT}* : <${currentBuild.absoluteUrl}|Report>\n${msgSlack}"
    slackSend channel: '#automation-testing', color: colour, message: finalMessage
}