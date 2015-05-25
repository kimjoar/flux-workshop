import _ from 'lodash';
import React from 'react';

import Alert from './Alert';
import Spinner from './Spinner';
import Message from './Message';

function getStateFromStores(props) {
    return {
    };
}

export default React.createClass({

    propTypes: {
        // The current channel
        channel: React.PropTypes.string.isRequired
    },

    getInitialState() {
        return getStateFromStores(this.props);
    },

    componentDidMount() {
        console.log('MESSAGES', 'mounting, props:', this.props);
    },

    componentWillUnmount() {
        console.log('MESSAGES', 'unmounting');
    },

    componentWillUpdate() {
        let node = React.findDOMNode(this);
        this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight;
    },

    componentDidUpdate() {
        if (this.shouldScrollBottom) {
            let node = React.findDOMNode(this);
            node.scrollTop = node.scrollHeight;
        }
    },

    render() {
        return <div className='chat'>
            { this.content() }
        </div>
    },

    content() {
        let messages = this.state.messages;

        if (messages == null) {
            return <Spinner type='large' />
        }

        console.log('MESSAGES', 'rendering', messages && messages.count());

        if (messages.count() == 0) {
            return <p>Ingen meldinger</p>
        }

        return <ul className='messages'>
            { messages.map(this.renderMessage) }
        </ul>
    },

    renderMessage(message) {
        return <li key={ message.getIn(['fields', 'cid']) }>
            <Message
                message={ message }
                channel={ this.props.channel } />
        </li>
    },

    _onChange() {
        this.setState(getStateFromStores(this.props));
    }

});

