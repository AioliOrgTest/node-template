#!/usr/bin/env groovy

def environment = env.BRANCH_NAME
if (environment == "develop") {
    properties([
        pipelineTriggers([cron("H H * * H(6-7)")]), // Saturday _or_ Sunday at any time, distributed
    ])
} else if (environment == "release") {
    properties([
        pipelineTriggers([cron("H H(18-23) * * H(2-4)")]), // Middle of the week at any time after 6PM, distributed
    ])
}

@Library(["skillsoft-ci-pipeline"]) _

node('innrd87') {
    def deployOptions = [
        podName           : "node-template",
        buildType         : "node",
        // The test folder cannot be an empty string.
        testFolder        : "test-results",
        namespace         : "provisioning-services",
        additionalTags    : [],
        dockerBuildOptions: [],
    ]
    common(deployOptions)
}
