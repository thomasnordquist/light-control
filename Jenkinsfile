node {
  def workspace = pwd()
  def cache = "${workspace}/cache"

  stage('prepare') {
    sh "mkdir -p ${cache}"
    dir('build') {
      deleteDir()
      checkout scm
    }
  }

  def app = docker.image('thomasnordquist/docker-cordova-build-environment')
  
  stage('npm install') {
    dir('build/webapp') {
      app.inside("-v ${cache}:/home/build") {
        sh "npm install"
      }
    }
  }

  stage('npm run build') {
    dir('build/webapp') {
      app.inside {
        sh "npm run build"
        sh "npm run copy-to-cordova"
      }
    }
  }

  stage('cordova build') {
    dir('build/cordova') {
      app.inside("-v ${cache}:/home/build") {
        sh "cordova platform add android"
	    sh "cordova build"
      }
    }
  }

  archive (includes: '/cordova/platforms/android/build/outputs/apk/*.apk')
}
