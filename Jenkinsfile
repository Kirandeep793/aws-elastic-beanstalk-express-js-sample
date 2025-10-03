
// Jenkins Pipeline for Node.js App
// Author: Kirandeep
// This pipeline builds, tests, scans, and pushes a Docker image using Grype and Clair for security.
// Jenkins is configured via JCasC YAML (jenkins-config.yaml) and Blue Ocean UI is enabled.
// All credentials and configuration are loaded from the .env file for security and flexibility.

pipeline {
    agent any
    options {
        // Discard old builds to save disk space
        buildDiscarder(logRotator(numToKeepStr: '5', daysToKeepStr: '7'))
    }
    environment {
        // Registry, repo, and image names can be overridden by environment variables
        REGISTRY = "${env.DOCKER_REGISTRY ?: 'docker.io'}"
        REPO = "${env.DOCKER_REPO ?: 'myorg'}"
        IMAGE = "${env.APP_IMAGE ?: 'myapp'}"
        LOCAL_BIN = "${WORKSPACE}/bin"
    }
    stages {
        stage('Checkout Source') {
            steps {
                // Always start with a clean checkout
                echo 'Checking out source code...'
                checkout scm
            }
        }
        stage('Install Dependencies & Test') {
            agent { docker { image 'node:16-alpine' } }
            steps {
                // Install dependencies and run tests inside a Node.js container for consistency
                echo 'Installing dependencies and running tests...'
                sh '''
                  npm ci
                  npm test -- --ci --reporters=default --reporters=jest-junit
                '''
                // Publish test results and logs for visibility
                junit 'junit.xml'
                archiveArtifacts artifacts: '**/junit.xml,logs/**/*.log', allowEmptyArchive: true
            }
        }
        stage('Filesystem Security Scan (Grype)') {
            steps {
                // Use Grype to scan the workspace for vulnerabilities before building the image
                echo 'Scanning workspace with Grype...'
                sh '''
                  if ! command -v grype > /dev/null; then
                    curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /tmp
                    export PATH="/tmp:$PATH"
                  fi
                  grype dir:. --fail-on high
                '''
            }
        }
        stage('Build Docker Image') {
            steps {
                // Build the Docker image and tag with both commit and latest
                echo 'Building Docker image...'
                script {
                    env.IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
                sh '''
                  docker build -t ${REGISTRY}/${REPO}/${IMAGE}:${IMAGE_TAG} -t ${REGISTRY}/${REPO}/${IMAGE}:latest .
                '''
            }
        }
        stage('Install Trivy (no root)') {
            steps {
                sh '''
                set -eux
                mkdir -p "${LOCAL_BIN}"
                curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh \
                    | sh -s -- -b "${LOCAL_BIN}"
                export PATH="${LOCAL_BIN}:${PATH}"
                trivy --version
                '''
            }
        }

        stage('Vuln Scan (Trivy Image)') {
            steps {
                sh '''
                set -eux
                export PATH="${LOCAL_BIN}:${PATH}"
                # Scan the image built in the previous step (with repo and tag)
                trivy image --severity HIGH,CRITICAL --exit-code 1 --no-progress \
                    --skip-dirs /usr/local/lib/node_modules \
                    ${REGISTRY}/${REPO}/${IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                // Push Docker image to registry using credentials
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
                    sh '''
                        set -eux
                        echo "$REG_PASS" | docker login -u "$REG_USER" --password-stdin
                        docker push ${REGISTRY}/${REPO}/${IMAGE}:${IMAGE_TAG}
                        docker push ${REGISTRY}/${REPO}/${IMAGE}:latest
                    '''
                }
            }
        }
    }
    post {
        always {
            // Clean up Docker resources after every build to avoid disk bloat
            echo 'Cleaning up Docker resources and workspace...'
            sh 'docker system prune -f || true'
        }
    }
}

