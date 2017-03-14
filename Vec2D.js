'use strict';

class Vec2D {
		constructor(x, y) {
				this.x = x;
				this.y = y;
		}

		distance(vec) {
			return Math.sqrt(
				Math.pow(Math.abs(this.x-vec.x), 2)
				+ Math.pow(Math.abs(this.y-vec.y), 2)
			)
		}
}

module.exports = Vec2D
