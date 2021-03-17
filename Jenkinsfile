pipeline{
    agent any

    stages {
        stage('Deployment'){
            steps{
                sh '''
                        docker-compose -f /opt/bt-tokenizer/docker-compose.yml down || true
                        docker image rm bt-webapp
                        docker build -t bt-webapp .
                        docker-compose -f /opt/bt-tokenizer/docker-compose.yml up -d
                '''
            }
        }
    }
}
