/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Remote from '../RemoteCommand';
import AppBar from 'material-ui/AppBar';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MyTheme from './Theme.react';
import IdleHandler from './IdleHandler.react'

const AppBarExampleIcon = () => (
  <AppBar
    title="Title"
    iconClassNameRight="muidocs-icon-navigation-expand-more"
  />
);

class App extends Component {
  getChildContext() {
    var theme = getMuiTheme(MyTheme);
    theme.slider.trackSize = 3;
    theme.slider.handleSize = 24;
    theme.slider.handleSizeDisabled = 24;
    theme.slider.handleSizeActive = 28;
    return {
        muiTheme: theme
    };
}

  render() {
    return (
      <div className="wrapper">
        <AppBar
          title="Light Control"
          iconElementLeft={
            <IconMenu
              iconButtonElement={
                <IconButton><NavigationMenu /></IconButton>
              }
              anchorOrigin={{horizontal: 'left', vertical: 'top'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
            >
                <MenuItem onClick={() => Remote.sendCommand({rainbow: 'toggle'})} primaryText="Rainbow" />
                <MenuItem onClick={() => Remote.sendCommand({rotation: 'toggle'})} primaryText="Rotation" />
                <MenuItem onClick={() => Remote.sendCommand({the_v: 'toggle'})} primaryText="The V" />
                <MenuItem onClick={() => Remote.sendCommand({rotation_mask: 'toggle'})} primaryText="Rotation Mask" />
                <MenuItem onClick={() => Remote.sendCommand({fire: 'fire'})} primaryText="Fire" />
                <MenuItem onClick={() => Remote.sendCommand({strobe: true})} primaryText="Strobe" />
            </IconMenu>
          }
          iconElementRight={
              <IconButton onClick={() => Remote.sendCommand({power: 'toggle'})} touch={true}><PowerIcon /></IconButton>
          }
        />
        { this.props.children }
        <IdleHandler />
      </div>
    );
  }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

// Wrap the component to inject dispatch and state into it
export default App;
