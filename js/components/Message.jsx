import React from 'react';
import { Map } from 'immutable';

import MessagesActionCreator from '../actions/MessagesActionCreator';

export default React.createClass({

    propTypes: {
        // The message to display
        message: isMessage,
        // The current channel
        channel: React.PropTypes.string.isRequired
    },

    render() {
        let message = this.props.message;
        let fields = message.get('fields');

        if (message.has('error')) {
            return this.renderFailed();
        }

        return <div className='message'>
            { fields.get('body') }
        </div>
    },

    renderFailed() {
        let message = this.props.message;
        let fields = message.get('fields');

        return <div className='message message-failed'>
            Sending "{ fields.get('body') }" message. <button onClick={ this._onRetry }>Retry</button>
        </div>
    },

    _onRetry() {
        let message = this.props.message;
        let channel = this.props.channel;

        console.log('MESSAGE', 'retry', message);

        // TODO: Use action for saving message to retry
    }

});

function isMessage(props, propName, componentName) {
    let prop = props[propName];
    if (!(prop instanceof Map)) {
        return new Error('Not an immutable map');
    }
    if (!prop.has('fields')) {
        return new Error('No fields');
    }
    if (!prop.get('fields').has('body')) {
        return new Error('No message body');
    }
}
