pipeline{
    agent any

    stages {
        stage('Deployment'){
            steps{
                sh '''
                        docker-compose -f /opt/bt-webapp/docker-compose.yml down || true
                        docker image rm bt-webapp || true
                        docker build -t bt-webapp .
                        docker-compose -f /opt/bt-webapp/docker-compose.yml up -d
                '''
            }
        }
    }
}
