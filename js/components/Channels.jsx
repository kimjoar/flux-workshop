import cx from 'classnames';
import React from 'react';
import { Link } from 'react-router';

export default React.createClass({

    propTypes: {
        // The currently active channel
        active: React.PropTypes.string.isRequired
    },

    getInitialState() {
        return {
            channels: ['general', 'random']
        }
    },

    render() {
        return <ul className="channels">
            { this.state.channels.map(this.channel) }
        </ul>
    },

    channel(channel) {
        let activeChannel = this.props.active;

        let classes = {
            'channel': true,
            'channel-active': activeChannel === channel
        };

        return <li className={ cx(classes) } key={ channel }>
            <Link to='channel' params={{ channel: channel }}>
                { channel }
            </Link>
        </li>
    }

});

