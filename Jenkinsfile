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
    }

    stages {
        stage("Build Docker Image") {
            steps {
                // 이 빌드 단계에서 젠킨스 Credential(Secret File)을 .env.local 파일로 바인딩하여 빌드에 전달합니다.
                // 자격 증명 ID가 'blog-lr-env'입니다.
                withCredentials([file(credentialsId: 'blog-lr-env', variable: 'ENV_FILE')]) {
                    script {
                        sh "cp \$ENV_FILE .env.local"
                        docker.build(
                            "${DOCKER_IMAGE_STORAGE}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}",
                            "."
                        )
                        sh "rm -f .env.local"
                    }
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
