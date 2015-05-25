import Immutable from 'immutable';
import io from 'socket.io-client';

import ajax from '../lib/ajax';
import Dispatcher from '../dispatcher/Dispatcher';
import createMessage from '../lib/createMessage';

export default {

    // Save a message in a channel
    create(channel, message) {
        // We extract the fields on the message and transform it into a regular
        // JavaScript object instead of an Immutable Map.
        let fields = message.get('fields').toJS();

        console.log('ACTION', 'saving message:', fields);

        ajax.post('/message/' + channel, fields).then(
            res => {
                console.log('ACTION', 'save successful:', res);

                let newFields = Immutable.fromJS(res);
                message = message.set('fields', newFields);

                // TODO: Dispatch message to stores
            });
    },

    fetchAll(channel) {
        console.log('ACTION', 'fetch all messages for channel:', channel);

        // TODO: Fetch all messages from `/messages/<channel>`
        // and dispatch 'receive_messages'
    },

    connect() {
        const socket = io();
        socket.on('message', data => {
            console.log('ACTION', 'receive WS', data);
            Dispatcher.dispatch({
                type: 'receive_message',
                channel: data.channel,
                message: createMessage(data.message)
            });
        });
    }

};

function createMessages(messages) {
    return Immutable.fromJS(messages)
        .map(createMessage);
}
