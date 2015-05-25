import React from 'react';
import { RouteHandler } from 'react-router';
import MessagesActionCreator from '../actions/MessagesActionCreator';

export default React.createClass({

    componentDidMount() {
        // TODO: Connect to WebSocket endpoint and listen for `message` events.
    },

    render() {
        // We call the route and pass along all the props
        // passed to this component.
        let route = <RouteHandler { ...this.props } />

        return <div>
            <header>
                <h1>Chat!</h1>
            </header>
            { route }
        </div>
    }

});

