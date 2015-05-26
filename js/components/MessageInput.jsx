import React from 'react';

import createMessage from '../lib/createMessage';
import MessagesActionCreator from '../actions/MessagesActionCreator';

const KEY_CODE_ENTER = 13;

export default React.createClass({

    propTypes: {
        // The current channel
        channel: React.PropTypes.string.isRequired
    },

    getInitialState() {
        return {
            body: ''
        }
    },

    componentDidMount() {
        this.focus();
    },

    render() {
        return <div className='chat-input'>
            <input
                ref='chatInput'
                type='text'
                value={ this.state.body }
                onChange={ this._onChange }
                onKeyUp={ this._save }
                />
        </div>
    },

    _onChange(e) {
        let body = e.target.value;
        this.setState({ body: body });
    },

    _save(e) {
        let keyCode = e.keyCode;
        let body = this.state.body;
        let channel = this.props.channel;

        if (keyCode == KEY_CODE_ENTER && body.trim() != '') {
            // We wrap the body in a message object
            // This returns an Immutable.js Map:
            // https://facebook.github.io/immutable-js/docs/#/Map
            let message = createMessage({ body: body });

            console.log('INPUT', 'enter pressed, saving:', message.toJS());

            // TODO: Create action that saves message

            // Reset input state
            this.setState(this.getInitialState());
        }
    },

    focus() {
        React.findDOMNode(this.refs.chatInput).focus();
    }

});

