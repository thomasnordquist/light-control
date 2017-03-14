/*
 * HomePage
 * This is the first thing users see of our App
 */

import { asyncChangeProjectName, asyncChangeOwnerName } from '../../actions/AppActions';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import HsvPicker from '../../HsvPicker'
import Vec2D from '../../Vec2D'


class HomePage extends Component {

  benchmark() {
    var before = (new Date());
    let amount = 150;
    for(var i=0;i<amount;i++) {
      this.buildCanvas();
    }
    alert('Rendering ' + amount + ' times took ' + parseInt((new Date()) - before) + 'ms');
  }

  buildCanvas() {
    let canvas = document.getElementById('myCanvas');
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, width, height);
    var image = imageData.data;

    let picker = new HsvPicker(width, height);

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
    ctx.putImageData(imageData, 0, 0);
  }

  abortEvent(evnt) {
      event.preventDefault();
  }
  updateColor(evnt) {
      event.preventDefault();
      let canvas = document.getElementById('myCanvas');
      let width = canvas.clientWidth;
      let height = canvas.clientHeight;
      let picker = new HsvPicker(width, height);

      let x = Math.max(evnt.pageX-canvas.offsetLeft, 0);
      let y = Math.max(evnt.pageY-canvas.offsetTop, 0);
      let rgba = picker.rgbForPoint(new Vec2D(y, x));
      let color = picker.rgbaToHexString(rgba);
      let colorView = document.getElementById('colorView');
      var body = document.getElementsByTagName('body')[0];
      body.style.backgroundColor = color;

  }

  componentDidMount() {
      this.buildCanvas();
      let canvas = document.getElementById('myCanvas');
      canvas.addEventListener('mousemove', this.updateColor)

  }

  render () {
    return <div>
          <canvas onTouchMove={(e) => {this.updateColor(e)}} id="myCanvas" width="400" height="400" />
          <button id="colorView" onClick={this.buildCanvas}>BuildCanvas</button>
          <button onClick={this.benchmark.bind(this)}>Benchmark</button>
          </div>
  }
}

// REDUX STUFF

// Which props do we want to inject, given the global state?
function select(state) {
  return {
    data: state
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(HomePage);
