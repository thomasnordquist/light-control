node {
  checkout scm
  def app = docker.image('thomasnordquist/docker-cordova-build-environment')
  
  stage('npm install') {
    dir('webapp') {
      app.inside {
        sh "npm install"
      }
    }
  }

  stage('npm run build') {
    dir('webapp') {
      app.inside {
        sh "npm run build"
	sh "npm run copy-to-cordova"
      }
    }
  }

  stage('cordova build') {
    dir('cordova') {
      app.inside {
        sh "cordova platform add android"
	sh "cordova build"
      }
    }
  }

}
