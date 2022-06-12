# Jenkins

## Introduction to pipelines

Jenkins Pipeline (or simply "Pipeline") is a suite of plugins which supports implementing and integrating continuous delivery pipelines into Jenkins.

A *continuous delivery pipeline* is an automated expression of your process of getting software from version control right through to your users and customers.

Jenkins Pipeline provides an extensible set of tools for modeling simple-to-complex delivery pipelines "as code". The definition of a Jenkins Pipeline is typically written into a text file (called a `Jenkinsfile`) which in turn is checked into a project’s source control repository.

to get started quickly with Pipeline:

1.  Create a  `Jenkinsfile`
2. Click the **New Item** menu within Jenkins
3. Provide a name for your new item (e.g. **My-Pipeline**) and select **Multibranch Pipeline**
4. Click the **Add Source** button, choose the type of repository you want to use and fill in the details.
5. Click the **Save** button and watch your first Pipeline run!


For **Node.js**


```groovy
pipeline {
    agent { docker { image 'node:16.13.1-alpine' } }
    stages {
        stage('build') {
            steps {
                sh 'node --version'
            }
        }
    }
}
```

The agent in this case is docker , which means the stages will run on the specified image ( it's our agent : worker ). Jenkins will coordinate our different agents to do the necessary jobs.

IMPORTANT : docker plugins need to be installed if we want to use it as an agent


We use the web app of jenkins to start the build, the docker image will be pulled and the different stages will take place. If we linked a github repo to the build process, it will be notified once the build is successfull, it will also be notified in case of a failure.



## Running multiple steps

Pipelines are made up of multiple steps that allow you to build, test and deploy applications. Jenkins Pipeline allows you to compose multiple steps in an easy way that can help you model any sort of automation process.

Think of a "step" like a single command which performs a single action. When a step succeeds it moves onto the next step. When a step fails to execute correctly the Pipeline will fail.


### Timeouts and retries

here are some powerful steps that "wrap" other steps which can easily solve problems like retrying (retry) steps until successful or exiting if a step takes too long (timeout).


```groovy
pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                retry(3) {
                    sh './flakey-deploy.sh'
                }

                timeout(time: 3, unit: 'MINUTES') {
                    sh './health-check.sh'
                }
            }
        }
    }
}
```

The "Deploy" stage retries the flakey-deploy.sh script 3 times, and then waits for up to 3 minutes for the health-check.sh script to execute. If the health check script does not complete in 3 minutes, the Pipeline will be marked as having failed in the "Deploy" stage.


We can **compose** these steps together. For example, if we wanted to retry our deployment 5 times, but never want to spend more than 3 minutes in total before failing the stage:

```groovy
pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    retry(5) {
                        sh './flakey-deploy.sh'
                    }
                }
            }
        }
    }
}
```

### Post Execution steps

When the Pipeline has finished executing, you may need to run clean-up steps or perform some actions based on the outcome of the Pipeline. These actions can be performed in the `post`section.


```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'echo "Fail!"; exit 1'
            }
        }
    }
    post {
        always {
            echo 'This will always run'
        }
        success {
            echo 'This will run only if successful'
        }
        failure {
            echo 'This will run only if failed'
        }
        unstable {
            echo 'This will run only if the run was marked as unstable'
        }
        changed {
            echo 'This will run only if the state of the Pipeline has changed'
            echo 'For example, if the Pipeline was previously failing but is now successful'
        }
    }
}
```

#### Email


```groovy
post {
    failure {
        mail to: 'team@example.com',
             subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
             body: "Something is wrong with ${env.BUILD_URL}"
    }
}
```

#### Slack 

```groovy
post {
    success {
        slackSend channel: '#ops-room',
                  color: 'good',
                  message: "The pipeline ${currentBuild.fullDisplayName} completed successfully."
    }
}
```

## Defining execution environments

The `agent` directive tells Jenkins where and how to execute the Pipeline, or subset thereof. As you might expect, the agent is required for all Pipelines.




Underneath the hood, there are a few things agent causes to happen:

- All the steps contained within the block are queued for execution by Jenkins. As soon as an executor is available, the steps will begin to execute.

- A workspace is allocated which will contain files checked out from source control as well as any additional working files for the Pipeline.


Pipeline is designed to easily use Docker images and containers to run inside. This allows the Pipeline to define the environment and tools required without having to configure various system tools and dependencies on agents manually. This approach allows you to use practically any tool which can be packaged in a Docker container.


## Using environment variables

Environment variables can be set globally, like the example below, or per stage. As you might expect, setting environment variables per stage means they will only apply to the stage in which they’re defined.

```groovy
pipeline {
    agent {
        label '!windows'
    }

    environment {
        DISABLE_AUTH = 'true'
        DB_ENGINE    = 'sqlite'
    }

    stages {
        stage('Build') {
            steps {
                echo "Database engine is ${DB_ENGINE}"
                echo "DISABLE_AUTH is ${DISABLE_AUTH}"
                sh 'printenv'
            }
        }
    }
}
```


This approach to defining environment variables from within the Jenkinsfile can be very useful for instructing scripts, such as a `Makefile`, to configure the build or tests differently to run them inside of Jenkins.

We can use environment variables to pass the names of sensitive secrets ( that are secured by jenkins ) into our executors , for example : 

```groovy
        stage('Example stage 1') {
            environment {
                BITBUCKET_COMMON_CREDS = credentials('jenkins-bitbucket-common-creds')
            }
            steps {
                // 
            }
```


## Recording tests and artifacts 

While testing is a critical part of a good continuous delivery pipeline, most people don’t want to sift through thousands of lines of console output to find information about failing tests.

To make this easier, Jenkins can record and aggregate test results so long as your test runner can output test result files. Jenkins typically comes bundled with the junit step, but if your test runner cannot output JUnit-style XML reports, there are additional plugins which process practically any widely-used test report format.



To collect our test results and artifacts, we will use the `post` section.

```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh './gradlew check'
            }
        }
    }
    post {
        always {
            junit 'build/reports/**/*.xml'
        }
    }
}
```

This will always grab the test results and let Jenkins track them, calculate trends and report on them. A Pipeline that has failing tests will be marked as "UNSTABLE", denoted by yellow in the web UI. That is distinct from the "FAILED" state, denoted by red.


> Pipeline execution will by default proceed even when the build is unstable. To skip deployment after test failures in Declarative syntax, use the skipStagesAfterUnstable option. In Scripted syntax, you may check currentBuild.currentResult == 'SUCCESS'. 



When there are test failures, it is often useful to grab built artifacts from Jenkins for local analysis and investigation. This is made practical by Jenkins’s built-in support for storing "artifacts", files generated during the execution of the Pipeline.

This is easily done with the archiveArtifacts step and a file-globbing expression, as is demonstrated in the example below:

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh './gradlew build'
            }
        }
        stage('Test') {
            steps {
                sh './gradlew check'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'build/libs/**/*.jar', fingerprint: true
            junit 'build/reports/**/*.xml'
        }
    }
```

Recording tests and artifacts in Jenkins is useful for quickly and easily surfacing information to various members of the team. In the next section we’ll talk about how to tell those members of the team what’s been happening in our Pipeline.

## Deployment

The most basic continuous delivery pipeline will have, at minimum, three stages which should be defined in a Jenkinsfile: Build, Test, and Deploy. For this section we will focus primarily on the Deploy stage, but it should be noted that stable Build and Test stages are an important precursor to any deployment activity.

```groovy
pipeline {
    agent any
    options {
        skipStagesAfterUnstable()
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying'
            }
        }
    }
}
```

### Asking for human input to proceed

Often when passing between stages, especially environment stages, you may want human input before continuing. For example, to judge if the application is in a good enough state to "promote" to the production environment. This can be accomplished with the input step. In the example below, the "Sanity check" stage actually blocks for input and won’t proceed without a person confirming the progress.

```groovy
pipeline {
    agent any
    stages {
        /* "Build" and "Test" stages omitted */

        stage('Deploy - Staging') {
            steps {
                sh './deploy staging'
                sh './run-smoke-tests'
            }
        }

        stage('Sanity check') {
            steps {
                input "Does the staging environment look ok?"
            }
        }

        stage('Deploy - Production') {
            steps {
                sh './deploy production'
            }
        }
    }
}
```
