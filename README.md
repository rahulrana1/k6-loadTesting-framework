# k6-loadtesting

## What is k6?

K6 is a developer centric tool for automated performance testing. <br />
To learn more, https://k6.io/ <br />
And watch https://www.youtube.com/watch?v=Hu1K2ZGJ_K4

## How to run load tests?
Type below command to see the documentation and features of the framework. This would show available commands in the framework.
```
./go
```

To build a docker image, use below command
```
./go build_docker_image
```

To run a load test for nodejs, use below command
```
./go docker_run_nodejs_loadtest
```

For more info, see go file in root directory. After adding scenario for a new microservice, don't forget to add functions in go file.

## How env variables are handled ?

#### Locally <br />
create a .env file in the root directory. Add following env variables to it.

```
ENVIRONMENT=UAT
INFLUXDB_URL=http://localhost:8086/nameOfYourLocalDatabase
K6_CONTAINER_NAME=k6container
```

#### Jenkins <br />
Jenkinsfile contains environment variables.

## Framework Structure

* **Tests** <br />
    * This is where you can write tests for endpoints in microservice.
    * Every microservice should have tests under its own folder. e.g: scripts for nodejs are under nodejs folder.
    * As a best practise, check the error rate in test files.

* **Scenarios** <br />
    * This is to design the work load model
    * Every microservice have one *scenario.js file
    * Purpose of scenarios file is to run a realistic load test and hitting multiples endpoints at same time.
    * Configuartions such as concurrent user, RPS etc can be configured here.
    * There are 7 types of executor in K6, follow the docuemntation to learn more. https://k6.io/docs/using-k6/scenarios/executors

* **postman** <br />
    * Contains enviroment variable files used in postman tests, same test data files are used here
    * Contains postman collection, it is used to create a valid session cookie
    * test.js files read valid session cookies from environment variable files
    * envVariable files contains test data used by test.js files

* **Docker** <br />
    * The dockerfile here uses a multi-stage build. You can notice that it uses two FROM statements. It gets k6 and nodejs into one image.

* **shellScripts** <br />
    * Has .sh files containing commands to run load tests in docker

* **utils** <br />
    * Contains resuable utility functions
