node("docker") {
  checkout scm
  def app = docker.image('thomasnordquist/docker-cordova-build-environment')
  
  stage('npm dependencies') {
    app.inside {
    	dir('webapp') {
		sh "npm install"
		sh "npm run build"
	    }
	}
  }
}
