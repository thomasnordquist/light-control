import Light from './Light'
import React, {Component} from 'react'
import Slider from 'react-slick'

require('slick-carousel/slick/slick.css')
require('slick-carousel/slick/slick-theme.css')
class LightControl extends Component {
  couchControls() {
    return [
      {
        description: 'Brightness',
        property: 'brightness',
        min: 0,
        max: 1,
        default: 0.5
      },
      {
        description: 'Width',
        property: 'width',
        min: 0,
        max: 1,
        default: 0.5
      },
      {
        description: 'Position',
        property: 'position',
        min: 0,
        max: 1,
        default: 0.5
      }
    ]
  }

  bedControls() {
    return [
      {
        description: 'Helligkeit',
        property: 'brightness',
        min: 0,
        max: 1,
        default: 0.5
      },
      {
        description: 'Speed',
        property: 'speed',
        min: 0,
        max: 1,
        default: 0.5
      },
      {
        description: 'Strobe',
        property: 'strobeSpeed',
        min: 0,
        max: 1,
        default: 0.5
      }
    ]
  }

  sliderCreated(slider) {
    //slider.
  }

  render () {
    var settings = {
      dots: true,
      arrows: false,
      infinite: false,
      speed: 400,
      slidesToShow: 1,
      slidesToScroll: 1,
      touchThreshold: 12
    };
    return (
      <Slider ref={(slider) => this.sliderCreated(slider)} {...settings}>
        <div><Light controls={this.couchControls()} title="Couch" /></div>
        <div><Light controls={this.bedControls()} title="Nachtisch" /></div>
      </Slider>
    );
  }
}

// Wrap the component to inject dispatch and state into it
export default LightControl;
