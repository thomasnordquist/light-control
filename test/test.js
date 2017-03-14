'use strict';

var Vec2D = require('../Vec2D');
var HsvPicker = require('../HsvPicker');

var assert = require('assert');

describe('Vec2D', () => {
  it('should construct', () => {
    let vec = new Vec2D(10, 20);
    assert.equal(vec.x, 10);
    assert.equal(vec.y, 20);
  })

  it('distance', () => {
    let vec1 = new Vec2D(0, 0);
    assert.equal(10, vec1.distance(new Vec2D(0, 10)));

    let vec2 = new Vec2D(3, 6);
    assert.equal(5, vec2.distance(new Vec2D(6, 10)));
  })
});

describe('HsvPicker', () => {
  it('should construct', () => {
    let picker = new HsvPicker(200, 150);
    assert.equal(200, picker.width);
    assert.equal(150, picker.height);
  });
  describe('testing mathmatic operations', () => {
    it('cone should have correct radius', () => {
      let picker1 = new HsvPicker(200, 150);
      assert.equal(75, picker1.radius);

      let picker2 = new HsvPicker(120, 200);
      assert.equal(60, picker2.radius);
    })

    it('cone should have correct depth', () => {
      let picker1 = new HsvPicker(200, 150);
      assert.equal(75, picker1.depth);

      let picker2 = new HsvPicker(120, 200);
      assert.equal(60, picker2.depth);
    })

    it('cone should have correct center', () => {
      let picker1 = new HsvPicker(200, 150);
      assert.equal(99, picker1.center.x); // x / 2 - 1
      assert.equal(74, picker1.center.y); // y / 2 -1
    })

    it('points should be insinde circle projection', () => {
      let picker = new HsvPicker(200, 150);
      let center = picker.center;
      let radius = picker.radius;

      let points = [
        center,
        new Vec2D(center.x + radius, center.y),
        new Vec2D(center.x, center.y+radius),
        new Vec2D(center.x-radius, center.y),
        new Vec2D(center.x, center.y-radius)
      ];

      points.forEach((point, idx) => {
        assert.equal(true, picker.isInsideCircle(point), 'Point #'+(idx+1)+' is not inside, but should be')
      });
    });

    it('points should be outside circle projection', () => {
      let picker = new HsvPicker(201, 151);
      let center = picker.center;
      let radius = picker.radius;

      let points = [
        new Vec2D(0, 0),
        new Vec2D(center.x + radius + 1, center.y),
        new Vec2D(center.x + 1, center.y+radius),
        new Vec2D(center.x-radius, center.y - 1),
        new Vec2D(center.x, center.y - radius - 0.000001)
      ];

      points.forEach((point, idx) => {
        assert.equal(false, picker.isInsideCircle(point), 'Point #'+(idx+1)+' is not outside, but should be')
      });
    });

    it('angle calculation', () => {
      let picker = new HsvPicker(2000, 1999);
      let center = picker.center;
      let radius = picker.radius;

      let testVectors = [
        [270, new Vec2D(center.x, center.y + radius)],
        [180, new Vec2D(center.x+radius, center.y)],
        [0, new Vec2D(center.x-radius, center.y)],
        [45, new Vec2D(center.x-radius, center.y-radius)],
        [90, new Vec2D(center.x, center.y - radius)]
      ];

      testVectors.forEach((vec, idx) => {
        assert.equal(vec[0], picker.angleForPoint(vec[1]), 'Point #'+(idx+1)+' has the wrong angle')
      });
    });

    it('depth projection', () => {
      let picker = new HsvPicker(2000, 1999);
      let center = picker.center;
      let radius = picker.radius;

      let testVectors = [
        [0, new Vec2D(center.x, center.y + radius)], // depth at the border should be 0
        [picker.depth/2, new Vec2D(center.x+radius/2, center.y)], // half the way
        [picker.depth, center] // depth at the center should be the deepest
      ];

      testVectors.forEach((vec, idx) => {
        assert.equal(vec[0], picker.depthForPoint(vec[1]), 'Point #'+(idx+1)+' has the wrong depth')
      });
    });
  });
  describe('color functions', () => {
    it('hueForPoint', () => {
      let picker = new HsvPicker(2000, 1999);
      let center = picker.center;
      let radius = picker.radius;
      assert.equal(0.5, picker.hueForPoint(new Vec2D(center.x+radius, center.y)));
    });

    it('saturationForPoint', () => {
      let picker = new HsvPicker(2000, 1999);
      let center = picker.center;
      let radius = picker.radius;
      assert.equal(0.5, picker.saturationForPoint(new Vec2D(center.x+(0.5*radius), center.y)));
    });

    it('valueForPoint', () => {
      let picker = new HsvPicker(2000, 1999);
      let center = picker.center;
      let radius = picker.radius;
      assert.equal(1, picker.saturationForPoint(new Vec2D(center.x+radius, center.y)));
    });
  });
});
