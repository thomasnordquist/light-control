import React, { Component } from 'react';
import HsvPicker from '../HsvPicker'
import Vec2D from '../Vec2D'
var throttle = require('lodash.throttle');

var staticCache = {
	'453x453': require('../../img/hsv_340x340.png')
};

class ColorPicker extends Component {
	componentDidMount() {
			this.buildCanvas();
			window.a=(c) => {this.benchmark(c)};
	}

	abortEvent(evnt) {
			evnt.preventDefault();
	}

	benchmark(canvas) {
		var before = (new Date());
		let amount = 150;
		for(var i=0;i<amount;i++) {
			this.buildCanvas(canvas);
		}
		alert('Rendering ' + amount + ' times took ' + parseInt((new Date()) - before) + 'ms');
	}

	colorPickerStyles() {
			return {
					margin: "12px auto auto auto",
					display: "block"
			};
	}

	buildCanvas(canvas) {
		if(!canvas)
				return;
				console.log(canvas)
		if(this.props.onChange) {
				this.onChange = throttle(this.props.onChange, 1000/25);
		}

		let ctx = canvas.getContext('2d');

		let scaleFactor = 1.33;
		let width = Math.ceil(canvas.clientWidth*scaleFactor);
		let height = Math.ceil(canvas.clientHeight*scaleFactor);

		// adjusting factor to the ceiled integer
		scaleFactor = width / canvas.clientWidth;

		setTimeout(() => {
			this.renderImage(width, height, ctx).then((imageData) => {
				ctx.scale(1/scaleFactor, 1/scaleFactor);
				ctx.translate(0.5, 0.5);
				ctx.drawImage(imageData, 0, 0);
			})
		}, 0);
	}

	renderImage(width, height, ctx) {
		let hash = width+'x'+height;
		console.log('hash '+hash)
		// try to find it in our cache
		if(staticCache[hash]) {
			// if it is an uri, convert to image
			if(typeof(staticCache[hash]) === 'string') {
					staticCache[hash] = this.imageFromURI(staticCache[hash])
					console.log('load from dataUri')
			} else {
					console.log('load from cache')
			}
			// return the cache hit
			return staticCache[hash];
		} else {
			staticCache[hash] = new Promise((resolve, reject) => {
					resolve(this.renderAntialisedImage(width, height, ctx));
			});

			return staticCache[hash];
		}
	}

	imageFromURI(uri) {
		return new Promise((resolve, reject) => {
			let image = new Image
			image.onload=() => {
				resolve(image)
			}
			image.src = uri
		})
	}

	renderAntialisedImage(width, height, ctx) {
			var imageData = ctx.getImageData(0, 0, width, height);

			let picker = new HsvPicker(width, height);

			var antialisingCanvas = document.createElement('canvas');
			antialisingCanvas.width = imageData.width;
			antialisingCanvas.height = imageData.height;

			var image = imageData.data;

			var bufferPos=0;
			for(var x=0; x<width; x++) {
				for(var y=0; y<height; y++) {
					let point = new Vec2D(x, y);
					var rgb = picker.rgbForPoint(point)

					image[bufferPos] = rgb[0];
					image[bufferPos+1] = rgb[1];
					image[bufferPos+2] = rgb[2];
					image[bufferPos+3] = rgb[3];
					bufferPos+=4;
				}
			}

			// antializing stuff
			ctx.imageSmoothingEnabled = true;
			ctx.mozImageSmoothingEnabled = true;
			ctx.webkitImageSmoothingEnabled = true;
			ctx.msImageSmoothingEnabled = true;

			var antialiasingContext = antialisingCanvas.getContext('2d');
			antialiasingContext.putImageData(imageData, 0, 0);

			antialiasingContext.beginPath();
			antialiasingContext.arc(picker.center.x, picker.center.y, picker.radius-0.66, 0, 2 * Math.PI, false);

			antialiasingContext.lineWidth = 2;
			antialiasingContext.strokeStyle = '#555';
			antialiasingContext.stroke();
			return antialisingCanvas;
	}

	updateColor(evnt) {
			let canvas = evnt.target;
			let width = canvas.clientWidth;
			let height = canvas.clientHeight;
			let picker = new HsvPicker(width, height);
			var pageX;
			var pageY;
			if(typeof(evnt.nativeEvent.touches) !== 'undefined') {
				if(evnt.nativeEvent.touches.length < 1) return;
				pageX = evnt.nativeEvent.touches[0].pageX;
				pageY = evnt.nativeEvent.touches[0].pageY;
			} else {
				pageX = evnt.nativeEvent.pageX;
				pageY = evnt.nativeEvent.pageY;
			}

			var rect = canvas.getBoundingClientRect();

			let x = Math.max(pageX-rect.left, 0);
			let y = Math.max(pageY-rect.top, 0);
			let rgba = picker.rgbForPoint(new Vec2D(y, x));
			let color = picker.rgbaToHexString(rgba);

			if(this.onChange && picker.isInsideCircle(new Vec2D(x, y))) {
				  evnt.preventDefault();
					evnt.stopPropagation();
					this.onChange(rgba);
			}
	}

	render() {
		 return <canvas style={this.colorPickerStyles()}
				onScroll={this.abortEvent}
				onTouchStart={ (e) => this.updateColor(e) }
				onMouseMove={ (e) => this.updateColor(e) }
				onTouchEnd={ (e) => this.updateColor(e) }
				onTouchMove={ (e) => this.updateColor(e) }
				ref={(c) => this.buildCanvas(c)} width={this.props.width} height={this.props.height} />
	}

}

module.exports = ColorPicker;
