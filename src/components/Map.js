import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Pusher from 'pusher-js';

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPosition: {
                lat: -23.6036299, 
                lng: -46.6939743,
            },
            destination: {
                lat: -23.6036299, 
                lng: -46.6939743,
            },
        }

        this.map = null;
        this.initPusher();
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
        if (prevProps.google !== this.props.google) {
            this.initMap(this.props.google.maps);
        } else {
            const maps = this.props.google.maps
            
            this.setDestination(maps);

            var position = new maps.LatLng(this.state.currentPosition.lat, this.state.currentPosition.lng)
            this.marker.setPosition(position);

            var bounds = new maps.LatLngBounds();
            bounds.extend(this.marker.getPosition());
            this.map.fitBounds(bounds);
            this.map.setZoom(this.map.getZoom()-5);
        }
    }

    setDestination(maps) {
        var position = new maps.LatLng(this.state.destination.lat, this.state.destination.lng);

        this.destination = new maps.Marker({
            position: position,
            map: this.map
        });
    }

    initMap(maps) {
        const mapRef = this.refs.myMap;
        const node = ReactDOM.findDOMNode(mapRef);

        this.map = new maps.Map(node, {
            zoom: 17,
            center: {lat: this.state.currentPosition.lat, lng: this.state.currentPosition.lng}
        });

        var position = new maps.LatLng(this.state.currentPosition.lat, this.state.currentPosition.lng);

        this.marker = new maps.Marker({
            position: position,
            map: this.map
        });
    }

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
