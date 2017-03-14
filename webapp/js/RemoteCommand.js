var W3CWebSocket = require('websocket').w3cwebsocket;
var jquery = require('jquery');

class Analytics {
		constructor() {
				this.sent = 0;
				this.received = 0;
				this.connections = 0;
		}

		receive() {
			this.received++;
		}

		send() {
			this.sent++;
		}

		connection() {
			this.connections++;
		}

		status() {
			console.log(sent, received, sent-received)
		}
}

var analytics = new Analytics();
window.analytics = analytics;
class RemoteCommand {
		constructor() {
				this.client = null;
				this.connected = false
				this.commandQueue = [];
				this.ready = false;
				this.lastCommand = null;
				this.canSendHttp = true;
				//this.openConnection();
				window.a=this.sendComand;
		}

		onError() {
				console.log('Connection Error');
		}

		/*sendCommand(cmd) {
				let cmdStr = JSON.stringify(cmd);

				if (this.client != null && this.client.readyState === this.client.OPEN) {
						window.analytics.send();
						this.ready = false;
						this.client.send(cmdStr);
				} else if(this.client == null) {
						this.commandQueue.push(cmd);
						this.openConnection();
				} else if(!this.canSend()) {

				}
		}*/

		handleLastCommand() {
			if (this.lastCommand && this.canSendHttp) {
				this.sendCommand(this.lastCommand);
				this.lastCommand = null;
			}
		}

		sendCommand(cmd) {
			if (this.canSendHttp) {
				this.canSendHttp = false;

				jquery.ajax({
				  type: "POST",
				  url: 'http://192.168.178.32/cmd',
				  data: cmd,
					timeout: 500
				}).always(() => {
					this.canSendHttp = true;
					this.handleLastCommand();
				})
			} else {
				this.lastCommand = cmd;
			}
		}

		canSend() {
				return this.ready;
		}

		onOpen() {
				console.log('WebSocket Client Connected', this);
				this.ready = true;
		}

		onClose() {
				this.client = null;
				this.ready = false;
				console.log('echo-protocol Client Closed');
		}

		onMessage(e) {
				window.analytics.receive();
				this.ready = true;
				this.lastEcho = (new Date()).getTime();
				if (typeof e.data === 'string') {
						console.log("Received: '" + e.data + "'");
				}
		}

		openConnection() {
				if(!this.connecting) {
						this.connecting = true;
						this.client = new W3CWebSocket('ws://192.168.178.32:81/', 'arduino');
						this.client.onerror = (e) => this.onError(e);
						this.client.onopen = (e) => this.onOpen(e);
						this.client.onclose = (e) => this.onClose(e);
						this.client.onmessage = (e) => this.onMessage(e);
						//setTimeout(() => this.checkConnection(), 2000)
				}
		}
}

module.exports = new RemoteCommand();
