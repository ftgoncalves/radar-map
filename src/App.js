import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './components/Map';
import { GoogleApiWrapper } from 'google-maps-react'


class App extends Component {
  constructor(props) {
    super(props);
    this.channel = null;
  }

  render() {
    return (
        <Map google={this.props.google} />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDVQBtplTYrUSB-aMYVTlJtWfUEs3Id1tk',
  libraries: ['visualization']
})(App)