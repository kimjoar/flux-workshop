# Flux-based Chat Application

This is a starting point showing how a Flux-based application can be implemented.

## Getting started

```sh
$ npm install
$ npm start
```

Go to http://localhost:9999/

## Development

```sh
# Frontend development
$ npm run watch

# Backend development
$ npm run server-watch
```

# Tasks

Start by running the development setup above, and open http://localhost:9999,
then open the console.

## Task 1 - Save a message

We'll start by saving messages. Go to `js/components/MessageInput.jsx`.
This component wraps the input field at the bottom of the screen. When we type
and press Enter, we should see a log in the console.

Use `js/actions/MessagesActionCreator.jsx` to create an action for saving the message.

When the save succeeds, dispatch an action using the `Dispatcher`. The input to
`Dispatcher.dispatch` is an object. We must always include a `type`, so the minimal
action is `{ type: 'some-type' }`.

You can find all the relevant types for these tasks in `js/stores/MessagesStore`.
Other than `type` you are free to add as many key/value pairs as you want.

Every dispatched message is logged in the MessagesStore, so you can use this to
debug your actions.

_Tips:_ The dispatcher docs: http://facebook.github.io/flux/docs/dispatcher.html

_Tips 2:_ Both the channel and the message is needed in the store, so both should
be sent.

There are helper methods for adding and updating messages at the bottom of `MessagesStore`.

After changing the state of the store, you must always remember to emit. Usually
this means calling `MessagesStore.emitChange()`. In the next tasks we will react
to these events.

For now you can check that everything works by logging the new `messages` state.

## Task 2 - Displaying saved messages

Now we want `js/components/Messages.jsx` to display the saved message. We start
with listening for changes on the `MessagesStore`. We do this by registering a
callback in `componentDidMount`, e.g.

```js
componentDidMount() {
    SomeStore.addChangeListener(this._onChange);
}
```

You should also remove the listener in `componentWillUnmount`.

There is already an `_onChange` method in the `Messages` component.
This callback uses the function `getStateFromStores`. This is a normal pattern
in Flux. As you can see it's also used in `getInitialState`.

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
if the messages received from the `MessagesStore` is undefined. If it is, we
know that we need to fetch messages from the backend.

To fetch messages we can implement the `fetchAll` method in
the `MessagesActionCreator`. We must remember to wrap the successfully received
messages by calling `createMessage` on each, i.e.

```js
let messages = messagesReceived.map(createMessage);
```

We can do this either in the action or in the store.

On success we dispatch it and update the state in the `MessagesStore`.
(Remember the helpers at the bottom. And remember to emit after change.)


