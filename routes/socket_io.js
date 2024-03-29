const router = require("express").Router();
var socket = require('socket.io')


router.post('/', function(req, res) {
    let room_ID = req.body.room_id;
    // Check valid input
    var pagedata = {
        'title': 'Projects',
        'navExpand': 'show',
        'room_ID': room_ID,
    };
    console.log("Trying to join room: ", room_ID);

    var exists = io.sockets.adapter.rooms[room_ID];

    if (typeof exists != 'undefined') {
        req.session.connectedRoom = room_ID;
        req.session.success = true;
        res.redirect(`/projects/newproject?room_id=${room_ID}`)
        // res.render('newproject', {pagedata:pagedata});
    } else {
        req.session.success = false;
        res.redirect('/projects');
        console.log("error connecting to room");
    }
});


function setup_socket_io(server) {
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
}


module.exports = {router, setup_socket_io}
