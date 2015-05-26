# Introduction to Flux

## Getting started

```sh
$ npm install

# Start server
$ npm start

# Build frontend (with watching)
$ npm run watch
```

# Tasks

Start by running the setup above, and open http://localhost:9999 and the
DevTools console.

The app uses both ImmutableJS and ES6, so check out these resources:

* http://facebook.github.io/immutable-js/
* https://github.com/lukehoban/es6features

## Task 1 - Save a message

We'll start by saving messages. Go to `js/components/MessageInput.jsx`.
This component wraps the input field at the bottom of the screen. When we type
and press Enter, we should see a log in the console.

Use `js/actions/MessagesActionCreator.jsx` to create an action for saving the
message.  All Ajax responses are immutable objects (created with ImmutableJS),
therefore it's often helpful to add `.toJS()` when logging them, e.g.

```js
console.log(newFields.toJS());
```

When the save succeeds, dispatch an action using the `Dispatcher`. The input to
`Dispatcher.dispatch` is an object. We should always include a `type`, as this
is used in the store to identify an action. Example dispatch:

```js
Dispatcher.dispatch({
    type: 'some-type',
    key: 'value',
    anotherKey: 42
});
```

You can find all the relevant types for these tasks in `js/stores/MessagesStore`.
Other than `type` you are free to add as many key/value pairs as you want.

Every dispatched message is logged in the `MessagesStore`, so you can use this
to debug your actions.

_Tips:_ The dispatcher docs: http://facebook.github.io/flux/docs/dispatcher.html

_Tips 2:_ Both the channel and the message is needed in the store, so both should
be sent.

There are helper methods for adding and updating messages at the bottom
of `MessagesStore`.

After changing the state of the store, you must always remember to emit. Usually
this means calling `MessagesStore.emitChange()`. In the next tasks we will react
to these events.

For now you can check that everything works by logging the new `messages` state
in the store.

## Task 2 - Displaying saved messages

Now we want `js/components/Messages.jsx` to display the saved message. We start
with listening for changes on the `MessagesStore`. We do this by registering a
listener in `componentDidMount`, e.g.

```js
componentDidMount() {
    SomeStore.addChangeListener(this._onChange);
}
```

This means that we add the listener when a component is added to the DOM. We
should always remove the listener in `componentWillUnmount`, i.e. when the
component is removed from the DOM.

_Tips:_ Learn more about React's lifecycle methods in
https://facebook.github.io/react/docs/component-specs.html#lifecycle-methods

There is already an `_onChange` method in the `Messages` component.
This callback uses the function `getStateFromStores`, which is a normal pattern
in Flux. As you can see the function is also used in `getInitialState`.

In `getStateFromStores`, use `MessagesStore#all` to fetch all the messages on
the current channel (which is available on the `props`).

The component should already handle rendering of the messages, so if you refresh
and try to create some messages, they should be rendered.

## Task 3 - Fetch messages from backend

Now it's time to fetch messages from the backend. Remember that ajax calls
should be done in action creators, not in stores.

Usually the fetch process is as follows:

- Component asks store for data
- If no data, create an action that fetches data
- Wait while data is fetched and change event is triggered
- Update the component with the new state

After the last step the component is re-rendered automatically when the state
is changed.

We start in the `Messages` component. In `componentDidMount` we can check if
messages are set. As this method is called after `getInitialState`, we can check
if the messages received from the `MessagesStore` is `undefined`. If it is, we
know that we need to fetch messages from the backend.

To fetch messages we can implement the `fetchAll` method in the
`MessagesActionCreator`. To get the messages on the correct form, we should
call `createMessage` on each message, i.e. `map` over the messages.

On success we dispatch the messages and update the state in the `MessagesStore`.
(Remember the helpers at the bottom. And remember to emit after change.)

Now, if you refresh you should see an initial message from the server.
If you write messages then refresh, they should be received from the server.

## Task 4 - Handling multiple channels

Now we need to handle multiple channels. If we switch between the channels on
the frontend, nothing happens and it keeps all the messages from `#general`.

To fix this we need to make changes to `Messages.jsx`, so it fetches the new
channel's messages when switching between the channels.

The reason this doesn't work already is that React does not remove the
component from the DOM when changing the route (i.e. changing the channel).
Therefore `componentDidMount` is not called when we change routes. Instead
`componentWillReceiveProps` is called with the new props, which in our case is
the new channel.

We therefore need to "reset" our component state based on the new props:

```js
componentWillReceiveProps(nextProps) {
    // nextProps will contain the new channel
    this.setState(...);
}
```

Again we can use `getStateFromStores` to get the state (i.e. messages), but now
for the new channel. Remember to send in the new props to get the correct
state.

When changing state we must remember that the component is responsible for
fetching data. One way of doing this is in the callback to `setState`:

```js
this.setState(newState, function() {
    if (this.state.someState == null) {
        // fetch data
    }
});
```

I.e. what happens in the callback is basically the same messages check
and action creation done in `componentDidMount`.

Now if we refresh and change tabs, data for the new channel should be fetched
and displayed.

## Task 5 - Error handling

It's time to handle errors when fetching messages. In `MessagesActionCreator`
we already handle the success case in the first callback to `then`. In the
second callback we receive an error, e.g.

```js
ajax.get('/url').then(
    res => {
        // handle success
    },
    err => {
        // handle error
    }
);
```

The task is to handle errors when `fetchAll` fails. One possibility is dispatching
an action with the type `receive_messages_failed` that includes the error. Then,
in the store, we can save this error the same way we set `messages`, i.e. its
own object, e.g. `errors`, that contain the last error for each channel.

There is already a function at the bottom of the store you can start with.
Btw, remember that we use ImmutableJS, so maps are immutable:

```
someMap.set('key', value);
someMap.get('key') // undefined

someMap = someMap.set('key', value);
someMap.get('key') // value
```

With this in place, the `Messages` component can fetch the error from the store
in its `getStateFromStores`, and, if there is an error, display an error using
the `Alert` component, e.g.

```js
let error = this.state.error;

if (error != null) {
    return <Alert>
        Feilmelding som skal vises til brukeren
    </Alert>
}
```

The easiest way to test this is by refreshing the application, stopping the
backend server, then going to the other channel. This should try to load the
channel's messages and fail, and it should display an error message to the user.
If you then start the server again, and go back and forth between the channels,
the messages should be loaded.

## Task 6 - Receive messages via WebSockets

The server has support for sending messages via WebSockets. There is a connection
setup already in `MessagesActionCreator`. If you connect when `App.jsx` mounts
and implements `receive_messages` in `MessagesStore`, you will receive all
messages sent to the server. To test this, open a new browser window and send
some messages and see them appear in the other window.

