import React from 'react';

import ChannelStore from '../stores/ChannelStore';

function getStateFromStores(props) {
    let channel = props.channel;
    return {
        isChannelActive: ChannelStore.isActive(channel)
    }
}

export default {

    propTypes: {
        channel: React.PropTypes.string.isRequired
    },

    getInitialState() {
        return getStateFromStores(this.props);
    },

    componentDidMount() {
        ChannelStore.addChangeListener(this._onActiveChannelChange);
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onActiveChannelChange);
    },

    componentWillReceiveProps(nextProps) {
        this.setState(getStateFromStores(nextProps));
    },

    _onActiveChannelChange() {
        this.setState(getStateFromStores(this.props));
    }

}
