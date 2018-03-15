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
        this.channel.bind('78e8c5a0-286c-11e8-b6db-579bdd5713bc', (data) => {
            this.updateState(data);
            console.log(data);
        });
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
            status: data.state
        });
    }

    fitMap(googleMaps) {
        var bounds = new googleMaps.LatLngBounds();
        
        bounds.extend(this.destination.getPosition());
        bounds.extend(this.marker.getPosition());

        this.map.fitBounds(bounds);

        googleMaps.event.addListenerOnce(this.map, "bounds_changed", (event) => { 
            if (this.getZoom() > 16) this.setZoom(16);
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.status == "delivered") {
            this.finishOrder();
        }

        if (prevProps.google !== this.props.google) {
            this.initMap(this.props.google.maps);
        } else {
            this.updateLocations(this.props.google.maps);
        }
    }

    initMap(maps) {
        const mapRef = this.refs.myMap;
        const node = ReactDOM.findDOMNode(mapRef);

        let initialPosition = new maps.LatLng(-23.5928949, -46.7137993);

        this.map = new maps.Map(node, {
            zoom: 15,
            center: initialPosition
        });

        maps.event.addListener(this.map, "idle", function() { 
            if (this.getZoom() > 16) this.setZoom(16);
        });
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

    updateOrderPosition(maps) {
        let position = new maps.LatLng(this.state.currentPosition.lat, this.state.currentPosition.lng);
        
        if (!this.marker) {
            this.marker = new maps.Marker({
                icon: 'https://cdn3.iconfinder.com/data/icons/wpzoom-developer-icon-set/500/130-32.png',
                map: this.map,
                position: position
            });
        } else {
            this.marker.setPosition(position);
        }
    }

    finishOrder() {
        this.audio = new Audio('/gas.mp3');
        this.audio.play();

        console.log("finishOrder()");
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
