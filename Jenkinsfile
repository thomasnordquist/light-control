node {
  checkout scm
  def workspace = pwd()

  def app = docker.image('thomasnordquist/docker-cordova-build-environment')

  stage('clean') {
    dir('cordova') {
      app.inside {
        sh "cordova clean"
      }
    }

    dir('webapp') {
      app.inside {
        sh "npm run clean"
      }
    }
  }
  
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
    dir('build/cordova') {
      app.inside {
        sh "cordova platform add android || echo Platform could not be added"
        sh "cordova build"
      }
    }
  }

  archive (includes: '/cordova/platforms/android/build/outputs/apk/*.apk')
}
