/*
 * HomePage
 * This is the first thing users see of our App
 */

import React, { Component } from 'react';
import Vec2D from '../../Vec2D'
import Slider from 'material-ui/Slider';
import ColorPicker from '../ColorPicker.react.js';

import Remote from '../../RemoteCommand';

class Light extends Component {
  constructor(props) {
    super(props);
  }

  updateColor(rgba) {
      var colorCmd = {red: rgba[0], green: rgba[1], blue: rgba[2]};
      this.sendCommand(colorCmd);
  }

  renderControl(ctrl) {
    return <Slider
        description={ctrl.description}
        onChange={ (event, val) => {this.updateProperty(event, ctrl.property, val)}}
        onDragStart={ (event, val) => {this.updateProperty(event, ctrl.property, val)}}
        onTouchStart={(e) => {e.stopPropagation()}}
        min={ctrl.min}
        max={ctrl.max}
        defaultValue={ctrl.default}
    />
  }

  updateProperty(event, property, val) {
    if(val != null && !Number.isNaN(val)) {
        val = (val)*255
        var obj = {}
        obj[property] = Math.round(val)
        this.sendCommand(obj);
    }
    event.preventDefault()
  }

  sendCommand(cmd) {
      Remote.sendCommand(cmd);
  }

  brightnessStyles() {
      return {
          margin: "32px auto auto auto",
          display: "block",
          width: "80%"
      };
  }

  styles() {
    return {
      controls: {
        width: "40%",
        display: "inline-block",
        marginTop: 16
      },
      picker:{
        marginTop:8,
        width: "40%",
        display: "inline-block",
        float: "left"
      },
      container: {
        height: '82vh',
        marginTop: -64,
        paddingTop: 64
      }
    }
  }

  render () {
    return (
      <center style={this.styles().container}>
          <h1>{this.props.title}</h1>
          <div>
              <div style={this.styles().picker}>
                <ColorPicker
                  width={340}
                  height={340}
                  onChange={(rgba) => {this.updateColor(rgba)}}
                  stopPropagation={true}
                  />
              </div>
              <div style={this.styles().controls}>
                {this.props.controls.map((ctrl) => this.renderControl(ctrl))}
              </div>
          </div>
      </center>)
  }
}

// Wrap the component to inject dispatch and state into it
export default Light;
