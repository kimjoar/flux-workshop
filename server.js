var _ = require('lodash');
var http = require('http');
var uuid = require('node-uuid');
var express = require('express');
var socketio = require('socket.io');
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');

var app = express();
app.use(bodyParser.json());
app.use(history());
app.use(express.static('dist'));
app.use(express.static('public'));

app.use(function(err, req, res, next) {
    require('util').inspect(err);
    res.status(500).send({ error: err.message });
});

var server = http.createServer(app);
var io = socketio(server);

var messages = {
    general: [{
        id: uuid.v4(),
        cid: uuid.v4(),
        body: "Welcome to the chat"
    }]
};

app.get('/messages/:channel', function(req, res) {
    var channel = req.params.channel;
    res.json(messages[channel] || []);
});

app.post('/message/:channel', function(req, res) {
    var channel = req.params.channel;
    var message = req.body;
    message.id = uuid.v4();

    if (!messages.hasOwnProperty(channel)) {
        messages[channel] = [];
    }

    messages[channel].push(message);

    res.json(message);
    io.emit('message', {
        channel: channel,
        message: message
    });
});

server.listen(9990, function() {
    console.log('Running on port 9990');
});

