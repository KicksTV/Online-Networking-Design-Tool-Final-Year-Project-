var express = require('express')
var socket = require('socket.io')
var expressSession = require('express-session')
const serveIndex = require('serve-index')
var defaultProjects = require('./assets/js/defaultProjects.js')
const path = require('path')
const bodyParser = require('body-parser')

var app = express();
app.set('view engine', 'ejs');

app.use('/assets', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/assets', express.static(path.join('node_modules/bootstrap/dist/js')));
app.use('/assets', express.static(path.join('node_modules/bootstrap/dist/css')));
app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.use('/test', express.static(path.join(__dirname, '/test')));

app.use('/assets', serveIndex(path.join(__dirname, '/assets')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({secret: 'secret', saveUninitialized: false, resave: false}));

app.get('/', function (req, res) {
    var pagedata = {
        'title': 'FrontPage',
        'navExpand': 'show',
    };
    res.render('frontpage', {pagedata:pagedata});
});
app.get('/projects', function (req, res) {
    var success = req.session.success;
    var user;
    var pagedata = {
        'title': 'Projects',
        'navExpand': 'show',
        'room_ID': req.session.connectedRoom,
        'success': success,
    };
    req.session.success = null;
    res.render('projects', {pagedata:pagedata, user:user, defaultProjects: defaultProjects});
});

app.post('/projects/join', function(req, res) {

    let room_ID = req.body.room_id;
    // Check valid input
    var pagedata = {
        'title': 'Projects',
        'navExpand': 'show',
        'room_ID': room_ID,
    };
    console.log("Trying to join room: ", room_ID);

    var exists = io.sockets.adapter.rooms[room_ID];
    console.log(exists);


    if (typeof exists != 'undefined') {
        req.session.connectedRoom = room_ID;
        req.session.success = true;
        res.render('newproject', {pagedata:pagedata});
    } else {
        req.session.success = false;
        res.redirect('/projects');
        console.log("error");
    }
});

app.get('/projects/leave-room', function(req, res) {
    req.session.connectedRoom = null;
    res.redirect('/projects');
});

app.get('/projects/newproject', function (req, res) {
    var user;
    var pagedata = {
        'title': 'New Project',
        'navExpand': '',
        'room_ID': req.query.room_ID,
    };
    res.render('newproject', {pagedata:pagedata, user:user});
});

app.get('/test/', function (req, res) {
    var pagedata = {
        'title': 'App Tests',
        'navExpand': 'show',
    };
    res.render('test', {pagedata:pagedata});
});

for (let project of defaultProjects.projects) {
    app.get(`/projects/loadproject/${project.projectName}`, function (req, res) {
        var user;
        var pagedata = {
            'title': project.projectName,
            'navExpand': 'show',
            'project': project.json
        };
        res.render('loadedProject', {pagedata:pagedata, user:user});
    });
}

for (let project of defaultProjects.projects) {
    app.get(`/projects/loadproject/${project.projectName}/get`, function (req, res) {
        res.json(JSON.stringify(project));
    });
}


var server = app.listen(5000, () => {
    console.log("The server is now running on port 5000!");
});

let io = socket.listen(server);

io.sockets.on('connection',
    function (socket) {
        console.log("We have a new client: " + socket.id);

        clientId=socket.handshake.query.clientId;
        socket.emit('connection', null);

        socket.on('createRoom',
            function(data) {
                socket.join(data.room);
            }
        );

        socket.on('joinRoom',
            function(data) {
                socket.join(data.room)
                let roomLeader = data.room;
                // sending to individual socketid (private message)
                console.log("room leader: ", roomLeader);
                io.to(roomLeader).emit('requestCanvasData', {room: roomLeader});
            }
        );

        socket.on('sentCanvasData',
            function(data) {
                // Send it to all other clients
                // socket.broadcast.emit('receivedCanvasData', data);

                // sending to all clients in 'game' room except sender
                console.log("sent data to room: ", data.room);
                socket.to(data.room).emit('receivedCanvasData', {value: data.value, room: data.room});
            }
        );
        socket.on('disconnect', function() {
            console.log("Client has disconnected");
        });
        socket.on('move',
            function(data) {
                // Data comes in as whatever was sent, including objects
                // console.log("Received: 'mouse' " + data.x + " " + data.y);      
                // Send it to all other clients
                socket.to(data.room).emit('move', data.value);
            }
        );
        socket.on('createComponent',
            function(data) {
                // Send it to all other clients
                socket.to(data.room).emit('createComponent', data.value);
            }
        );
        socket.on('componentMove',
            function(data) {
                // Send it to all other clients
                socket.to(data.room).emit('componentMove', data.value);
            }
        );
        socket.on('componentChange',
            function(data) {
                // Send it to all other clients
                socket.to(data.room).emit('componentChange', data.value);
            }
        );
    }
);

