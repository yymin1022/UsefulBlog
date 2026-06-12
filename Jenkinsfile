pipeline {
    agent any
    environment {
        GIT_MESSAGE = sh(returnStdout: true, script: "git log -n 1 --format=%s ${GIT_COMMIT}").trim()
        GIT_AUTHOR = sh(returnStdout: true, script: "git log -n 1 --format=%ae ${GIT_COMMIT}").trim()
        GIT_COMMIT_SHORT = sh(returnStdout: true, script: "git rev-parse --short ${GIT_COMMIT}").trim()
        GIT_INFO = "Branch(Version): ${GIT_BRANCH}\nLast Message: ${GIT_MESSAGE}\nAuthor: ${GIT_AUTHOR}\nCommit: ${GIT_COMMIT_SHORT}"
        
        DOCKERHUB_CREDENTIAL = "dockerhub-yymin1022"
        DOCKER_IMAGE_NAME = "blog-lr"
        DOCKER_IMAGE_STORAGE = "yymin1022"
        DOCKER_IMAGE_TAG = "release${BUILD_NUMBER}"

        // Firebase Web SDK config variables (Safe to store in git repository as they are public client keys)
        NEXT_PUBLIC_FB_API_KEY = "AIzaSyCKebijOLtw7y9af0UFBqVIZASF_jGVqME"
        NEXT_PUBLIC_FB_AUTH_DOMAIN = "blog-lr-b18ce.firebaseapp.com"
        NEXT_PUBLIC_FB_PROJECT_ID = "blog-lr-b18ce"
        NEXT_PUBLIC_FB_APP_ID = "1:247226604455:web:8f75d4707096699bbfb482"
        NEXT_PUBLIC_FB_MEASUREMENT_ID = "G-H95BTWQR7P"
    }

    stages {
        stage("Build Docker Image") {
            steps {
                script {
                    docker.build(
                        "${DOCKER_IMAGE_STORAGE}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}",
                        "--build-arg NEXT_PUBLIC_FB_API_KEY=${env.NEXT_PUBLIC_FB_API_KEY} " +
                        "--build-arg NEXT_PUBLIC_FB_AUTH_DOMAIN=${env.NEXT_PUBLIC_FB_AUTH_DOMAIN} " +
                        "--build-arg NEXT_PUBLIC_FB_PROJECT_ID=${env.NEXT_PUBLIC_FB_PROJECT_ID} " +
                        "--build-arg NEXT_PUBLIC_FB_APP_ID=${env.NEXT_PUBLIC_FB_APP_ID} " +
                        "--build-arg NEXT_PUBLIC_FB_MEASUREMENT_ID=${env.NEXT_PUBLIC_FB_MEASUREMENT_ID} ."
                    )
                }
            }
        }

        stage("Push Docker Image to Dockerhub") {
            steps {
                script {
                    image = docker.image("${DOCKER_IMAGE_STORAGE}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}")
                    docker.withRegistry("", DOCKERHUB_CREDENTIAL) {
                        image.push("$DOCKER_IMAGE_TAG")
                        image.push("latest")
                    }
                }
            }
        }
    }

    post {
        always {
            UsefulNotifier(currentBuild.currentResult)
        }
    }
}
