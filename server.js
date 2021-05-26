const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');

app.use(session({
    secret: 'masocket',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(express.static(__dirname + '/static'));
app.get('/', function(req, res) {
    res.render('index.ejs');
});
io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('online', '🟢' + socket.username + ' hopped into the chat!');
    });
    socket.on('disconnect', function(username) {
        io.emit('online', '⚪' + socket.username + ' left the chat.');
    })
    socket.on('chat', function(sms) {
        io.emit('chat', '<strong>' + socket.username + '</strong>: ' + sms);
    });
});
const server = http.listen(8000, function() {
    console.log('Listening on port 8000');
});