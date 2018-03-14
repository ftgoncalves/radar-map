import React, { Component } from 'react';
import Pusher from 'pusher-js';

export default class PusherComponents extends Component {
    constructor(props) {
        super(props);
        
        this.pusherClient = new Pusher('ff3cfb7147d390f3b6f8', {
            cluster: 'us2',
            encrypted: true
        });
    }

    componentWillMount() {
        
    }


}
