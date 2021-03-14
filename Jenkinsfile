pipeline{
    agent any

    stages {
        stage('Deployment'){
            steps{
                sh '''
                        docker build -t bt-webapp:prod .
                        docker run -p 80:80 --restart unless-stopped --name bt:webapp bt-webapp:prod
                '''
            }
        }
    }
}
