import p5Controller from './p5Controller'
import componentController from './componentController.js'
import saveLoadController from './saveLoadController.js'
import allComponents from '../collections/allComponents.js'
import Graph from '../models/graph.js'

var io = require('socket.io-client')
const p5 = require('p5')

const ioController = (function() {
    var instance;
    
    function init() {
     
        var socket = null;     
        var room_ID = null;
        var createRoomButton = null;

        async function init(room_id) {            
            // Instantly join room if you room_ID exists
            room_ID = room_id
            if (typeof room_ID != 'undefined' && room_ID != '' && room_ID != null) {
                console.log(room_ID);
                await initIO(room_ID);
            }
        }

        async function initIO(rid = null) {
            socket = await io.connect()

            // User has joined an already existing room
            if (rid != null) {
                alert(`You have joined a room: ${rid}`);
                createRoomButton.style.display = "none";
            }
           
            socket.on('connection', 
                async function() {
                    console.log("Response received");
                    
                    if (rid == null) {
                        room_ID = socket.id;
                        console.log("socket.id", socket.id);
                    }
                    if (room_ID != null) {
                        console.log(`You have connected to ${room_ID}`);
                        window.$vue.makeToast("Room Created", `You can invite others by sending them this key: ${room_ID}`, true)
                        // console.log('room_ID', room_ID);
                        sendData('joinRoom');
                    }
                }
            );

            socket.on('createRoom',
                function() {
                    console.log(socket);
                    sendData('createRoom', socket.id);
                }
            );

            // socket.on('joinRoom',
            //     function() {
            //         sendData();
            //     }
            // );

            socket.on('requestCanvasData', 
                async function() {
                    let json = await saveLoadController.saveEventToJSON();
                    console.log("Requesting canvas data: ", json);
                    if (json != null) {
                        sendData('sentCanvasData',  json);
                        console.log("Sent Data");
                    }
                }
            );

            socket.on('receivedCanvasData', 
                async function(data) {
                    console.log("Got canvas data", data.value);

                    // let json = await saveLoadController.saveEventToJSON();
                    // console.log(json);
                    saveLoadController.loadProject(data.value);
                    // sendData('sentCanvasData', json);
                }
            );

            socket.on('createComponent',
                async function(data) {
                    console.log("Got:", data);

                    let defaultComponent = await componentController.createNewComponent(data.name);

                    var newcomp = Object.assign(defaultComponent, data);

                    // ADDS IT TO ARRAY OF ALL components
                    allComponents.add(newcomp);

                    // Adds component to graph
                    Graph.getInstance().addNode(newcomp.id);
                }
            );
            socket.on('componentMove',
                async function(data) {
                    console.log("Got:", data);
                    var foundComponent = allComponents.getAll().find(c => c.id == data.id);
                    console.log(foundComponent)
                    if (foundComponent) {
                        p5Controller.getCanvas().moveComponent(foundComponent, data.x, data.y)
                    }
                }
            );
            socket.on('move',
                function(data) {
                    // console.log("Got: " + data.x + " " + data.y);
                    // FIXME: Should be moved into p5 controller
                    p5.push(); // Start a new drawing state
                    // Draw a blue circle
                    p5.fill(0,0,255);
                    p5.noStroke();
                    p5.ellipse(data.x,data.y,80,80);
                    p5.pop(); // Restore original state
                }
            );
            socket.on('componentChange',
                function(data) {
                    var foundComponent = allComponents.getAll().find(c => c.id == data.id);

                    var newcomp = Object.assign(foundComponent, data);

                    newcomp.image.width = data.width;
                    newcomp.image.height = data.height;

                    allComponents.getAll().map(item => item.id === data.id ? newcomp : item);
                }
            );
        }

        function getSocket() {
            return socket;
        }

        function setRoomID(id) {
            room_ID = id;
        }

        function getRoomID() {
            return room_ID;
        }

        function sendData(event , data = null) {
            // Send that object to the socket
            data = {value: data, room: room_ID}

            // Checks if a room has been created
            // If it hasn't then don't be sending any data
            if (socket != null) {
                // console.log("Sending Data");
                // console.log("socket", socket);
                socket.emit(event, data);
            } 
        }

        
        
        return {
            init:init,
            initIO:initIO,
            getSocket:getSocket,
            setRoomID:setRoomID,
            getRoomID:getRoomID,
            sendData:sendData,
        };   
    }
    return {
        getInstance: () => {
            if (!instance) {
                instance = init();
            }

            return instance
        }
    }
})();

export default ioController.getInstance();
