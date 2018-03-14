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
            status: "idle"
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

    fitMap(maps) {
        var bounds = new maps.LatLngBounds();
        
        bounds.extend(this.destination.getPosition());
        bounds.extend(this.marker.getPosition());

        this.map.fitBounds(bounds);
    }

    updateState(data) {
        this.setState({
            currentPosition: {
                lat: data.current_location.lat,
                lng: data.current_location.lng
            },
            destination: {
                lat: data.destination.lat,
                lng: data.destination.lng
            },
            status: data.status
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.status == "arrived") {
            this.finishOrder();
            return;
        }

        if (prevProps.google !== this.props.google) {
            this.initMap(this.props.google.maps);
        } else {
            this.updateLocations(this.props.google.maps);
        }
    }

    closeOrder() {
        this.audio.pause();
    }

    finishOrder() {
        this.audio = new Audio('srcfile.wav');
        this.audio.play();

        this.timer = setInterval(this.closeOrder(), 3000);
    }

    updateOrderPosition(maps) {
        let position = new maps.LatLng(this.state.currentPosition.lat, this.state.currentPosition.lng);
        
        if (!this.marker) {
            this.marker = new maps.Marker({
                //icon: require('truck.png'),
                map: this.map,
                position: position
            });
        } else {
            this.marker.setPosition(position);
        }
    }

    updateLocations(maps) {
        this.setDestination(maps);
        this.updateOrderPosition(maps);

        this.fitMap(maps);
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

        let initialPosition = new maps.LatLng(-23.5928949, -46.7137993);

        this.map = new maps.Map(node, {
            zoom: 17,
            center: initialPosition
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
