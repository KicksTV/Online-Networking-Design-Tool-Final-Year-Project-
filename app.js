var express = require('express');
var socket = require('socket.io');
const serveIndex = require('serve-index');
var defaultProjects = require('./assets/js/defaultProjects.js');
const path = require('path');


var app = express();
app.set('view engine', 'ejs');

app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.use('/assets', serveIndex(path.join(__dirname, '/assets')));


app.get('/', function (req, res) {
    var pagedata = {
        'title': 'FrontPage',
        'navExpand': 'show',
    };
    res.render('frontpage', {pagedata:pagedata});
});
app.get('/projects', function (req, res) {
    var user;
    var pagedata = {
        'title': 'Projects',
        'navExpand': 'show',
    };
    res.render('projects', {pagedata:pagedata, user:user, defaultProjects: defaultProjects});
});
app.get('/projects/newproject', function (req, res) {
    var user;
    var pagedata = {
        'title': 'New Project',
        'navExpand': '',
    };
    res.render('newproject', {pagedata:pagedata, user:user});
});

var server = app.listen(5000, () => {
    console.log("The server is now running on port 5000!");
});

let io = socket.listen(server);

io.sockets.on('connection',
    function (socket) {
        console.log("We have a new client: " + socket.id);
    
        socket.on('disconnect', function() {
            console.log("Client has disconnected");
        });


        socket.on('mouse',
            function(data) {
            // Data comes in as whatever was sent, including objects
            // console.log("Received: 'mouse' " + data.x + " " + data.y);      
            // Send it to all other clients
            socket.broadcast.emit('mouse', data);
            }
        );  

        socket.on('move',
            function(data) {
            // Data comes in as whatever was sent, including objects
            // console.log("Received: 'mouse' " + data.x + " " + data.y);      
            // Send it to all other clients
            socket.broadcast.emit('move', data);
            }
        );

        socket.on('createComponent',
            function(data) {
            // Send it to all other clients
            socket.broadcast.emit('createComponent', data);
            }
        );

        socket.on('componentMove',
            function(data) {
            // Send it to all other clients
            socket.broadcast.emit('componentMove', data);
            }
        );
    }
);

