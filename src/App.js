import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Pusher from 'pusher-js';

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }), withScriptjs, withGoogleMap)((props) =>
    <GoogleMap
      defaultZoom={15}
      defaultCenter={{ lat: -23.5840957, lng: -46.6898621 }}>
      <Marker position={{ lat: -23.5840957, lng: -46.6898621 }} />
    </GoogleMap>
)

var pusherClient = new Pusher('ff3cfb7147d390f3b6f8', {
  cluster: 'us2',
  encrypted: true
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.channel = null;
  }

  componentDidMount() {
    this.bindToChannel('felipe');
    this.channel.bind('felipe', function(data) {
      console.log(data.message);
    });
  }

  bindToChannel(channelName) {
    this.channel = pusherClient.subscribe(channelName); 
  }

  render() {
    return (
        <MyMapComponent isMarkerShown />
    );
  }
}
