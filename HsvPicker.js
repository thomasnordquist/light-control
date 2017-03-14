'use strict';
var Vec2D = require('./Vec2D');

class HsvPicker {
		constructor(width, height) {
				this.width = width;
				this.height = height;
				this.radius = this.caluclateRadius(); // radius of the code
				this.depth = this.radius;		// depth of the cone
				this.center = this.calculateCenter();
				this.angle = this.calulateAngle();
		}

		calulateAngle() {
			let opposite = this.radius;
			let adjacent = this.depth;
			return Math.asin(opposite/adjacent);
		}

		caluclateRadius() {
				return (Math.min(this.width, this.height)/2.0);
		}

		calculateCenter() {
				let x = Math.floor((this.width / 2)) - 1;
				let y = Math.floor((this.height / 2)) - 1;
				return new Vec2D(x, y);
		}

		isInsideCircle(vector) {
				return Math.sqrt(
					Math.pow(this.center.x - vector.x, 2) +
					Math.pow(this.center.y - vector.y, 2)) <= this.radius;
		}

		angleForPoint(vector) {
				var angle = Math.atan2(this.center.y - vector.y,this.center.x - vector.x) * (180/Math.PI);
				return angle >= 0 ? angle : 360 + angle; // remove negative angles
		}

		depthForPoint(vector) {
				let w = this.radius - this.center.distance(vector);
				return w/Math.sin(this.angle)
		}

		hueForPoint(vector) {
				return this.angleForPoint(vector)/360.0;
		}

		saturationForPoint(vector) {
				return this.center.distance(vector) / this.radius;
		}

		valueForPoint(vector) {
				return 1.0 - (this.depthForPoint(vector) / this.depth);
		}
}

module.exports = HsvPicker;
