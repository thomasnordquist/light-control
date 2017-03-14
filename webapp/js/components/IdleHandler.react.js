import React, { Component } from 'react';
import IdleDetector from '../IdleDetector'

class IdleHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {overlay: false}
    this.idleDetector = null
  }

  styles() {
    return {
      overlay: {
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'block',
        zIndex: 500000,
        width: '100%',
        height: '100%',
        backgroundColor: '#000'
      }
    }
  }

  componentDidMount() {
    this.idleDetector = new IdleDetector(() => this.handleIdle(), () => this.handleWakeUp())
  }

  componentWillUnmount() {

  }

  handleIdle() {
    this.setState({overlay: true})
    this.setBrightness(0);
  }

  handleWakeUp() {
    this.setState({overlay: false})
    this.setBrightness(128);
  }

  setBrightness(val) {
    console.log('Brightness', val)

    if(window.hello) {
      window.hello.setBrightness(val);
    }
  }

  render() {
    return null;//this.state.overlay ? <div style={this.styles().overlay} /> : <div />
  }
}

export default IdleHandler;
