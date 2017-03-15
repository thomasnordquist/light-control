node {
  checkout scm
  def workspace = pwd()

  def app = docker.image('thomasnordquist/docker-cordova-build-environment')

  stage('clean') {
    dir('cordova') {
      app.inside {
        sh "cordova clean || echo Cordova clean failed"
      }
    }

    dir('webapp') {
      app.inside {
        sh "yarn run clean || echo WebApp clean failed"
      }
    }
  }
  
  stage('yarn install') {
    dir('webapp') {
      app.inside {
        sh "yarn install"
      }
    }
  }

  stage('npm run build') {
    dir('webapp') {
      app.inside {
        sh "yarn run build"
        sh "yarn run copy-to-cordova"
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
