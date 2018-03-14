import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Pusher from 'pusher-js';

export default class Map extends Component {
    constructor(props) {
        super(props);
        -23.6039937,-46.6946932
        this.state = {
            lat: -23.6036299, 
            lng: -46.6939743
        }

        this.map = null;

        this.initPusher()
    }

    initPusher() {
        this.pusherClient = new Pusher('ff3cfb7147d390f3b6f8', {
            cluster: 'us2',
            encrypted: true
        });

        this.bindChannel()
    }

    bindChannel() {
        this.channel = this.pusherClient.subscribe("order-stream"); 
        this.channel.bind('5cc97000-2712-11e8-ba85-c917109fb6e3', (data) => {
            this.updateState(data);
            console.log(data);
        });
    }

    updateState(data) {
        this.setState({
            lat: data.current_location.lat,
            lng: data.current_location.lng
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const maps = this.props.google.maps;

        if (prevProps.google !== this.props.google) {
            this.initMap(maps)
        } else {
            setDestination()

            var position = new maps.LatLng(this.state.lat, this.state.lng)
            this.marker.setPosition(position);

            var bounds = new maps.LatLngBounds();
            bounds.extend(this.marker.getPosition());
            this.map.fitBounds(bounds);
            this.map.setZoom(this.map.getZoom()-5);
        }
    }

    // setDestination(maps) {
    //     this.marker = new maps.Marker({
    //         position: position,
    //         map: this.map
    //     });
    // }

    initMap(maps) {
        const mapRef = this.refs.myMap;
        const node = ReactDOM.findDOMNode(mapRef);

        this.map = new maps.Map(node, {
            zoom: 17,
            center: {lat: this.state.lat, lng: this.state.lng}
        });

        var position = new maps.LatLng(this.state.lat, this.state.lng);

        this.marker = new maps.Marker({
            position: position,
            map: this.map
        });
    }

    // componentWiUpdate() {
    //     var position = new maps.LatLng(this.state.lat, this.state.lng)
    //     this.marker.setPosition(position);
    // }

    render() {
        const style = {
            width: '100vw',
            height: '100vh'
          }

        return (
            <div ref='myMap' style={style}></div>
        );
    }
}
