import _ from 'lodash';
import uuid from 'node-uuid';
import { Map, List } from 'immutable';
import EventEmitter from 'events';

import createMessage from '../lib/createMessage';
import Dispatcher from '../dispatcher/Dispatcher';

const cidPath = ['fields', 'cid'];

// All the state for this store exists outside the code
// that is exported from this file, so we know that we
// have full control over changing it.

let messages = Map();

// READ API
//
// We create a regular object that inherits from EventEmitter.
// This gives is methods such as `on` and `emit` to register
// and emit events. Usually we only use a `change` event,
// therefore we have special helpers for this case.
//
// This object _only_ contain read APIs, i.e. it should have
// no methods that changes `messages`.
const MessagesStore = _.assign({}, EventEmitter.prototype, {

    // Return all messages on a channel
    all(channel) {
        return messages.get(channel);
    },

    // Every time make a change to the store,
    // use this method to notify listeners
    emitChange() {
        this.emit('change');
    },

    addChangeListener(callback) {
        this.on('change', callback);
    },

    removeChangeListener(callback) {
        this.removeListener('change', callback);
    },

});

// WRITE API
//
// We can change the state of the store through actions that
// are dispatched and received here.
//
// We must always remember to trigger `emitChange` after changing
// the state.
Dispatcher.register(action => {

    console.log('STORE', 'received action:', action);

    switch(action.type) {

        case 'receive_messages':
            break;

        case 'receive_messages_failed':
            break;

        case 'receive_message':
            break;

        case 'save_message_success':
            break;

        case 'save_message_failed':
            break;

        default:
            // noop

    }

});

export default MessagesStore;

// Reset all messages on a channel
function updateMessages(channel, newMessages) {
    console.log('STORE', 'messages received:', channel, newMessages.toJS());
    messages = messages.set(channel, newMessages.map(createMessage));
}

// Add or update a message on a channel
function addOrUpdateMessage(channel, message) {
    if (!messages.has(channel)) {
        messages = messages.set(channel, List());
    }

    let newMessages = messages.get(channel)
        // Exclude the message we're adding if its already in the list
        .filterNot(m => m.getIn(cidPath) == message.getIn(cidPath))
        // We then add our message
        .push(message);

    messages = messages.set(channel, newMessages);
}

function setErrorOnChannel(channel, error) {
    console.log('STORE', 'setting error on channel', channel);
}

function removeErrorFromChannel(channel) {
    console.log('STORE', 'removing error on channel', channel);
}

