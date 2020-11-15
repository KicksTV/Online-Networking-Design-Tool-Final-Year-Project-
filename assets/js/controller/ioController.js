import componentController from './componentController.js';
import saveLoadController from './saveLoadController.js';
import allComponents from '../collections/allComponents.js';
import Graph from '../models/graph.js';


const ioController = (function() {
    var instance;
    
    function init() {
     
        var io = require('socket.io-client')
        var socket = io.connect();     
        var room_ID = null;



        async function initIO(rid) {
            // We make a named event called 'createComponent' and write an
            // anonymous callback function
           
            socket.on('connection', 
                async function(data) {
                    console.log("You have connected");
                    
                    if (rid != null) {
                        room_ID = rid;
                        console.log("rid", rid);
        
                    } else {
                        room_ID = socket.id;
                        console.log("socket.id", socket.id);
                    }
                    if (room_ID != null) {
                        console.log(`You have connected to ${room_ID}`);
                        // console.log('room_ID', room_ID);
                        ioController.getInstance().sendData('joinRoom', null);
                    }
                }
            );

            socket.on('createRoom',
                function(data) {
                    console.log(socket);
                    sendData('createRoom', socket.id);
                }
            );

            // socket.on('joinRoom',
            //     function(data) {
            //         sendData();
            //     }
            // );

            socket.on('requestCanvasData', 
                async function(data) {
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
                    // console.log("Got:", data);
                    var foundComponent = allComponents.getAll().find(c => c.id == data.id);
                    if (foundComponent) {
                        foundComponent.move(data.x, data.y);
                    }
                }
            );
            socket.on('move',
                function(data) {
                    // console.log("Got: " + data.x + " " + data.y);
                    push(); // Start a new drawing state
                    // Draw a blue circle
                    fill(0,0,255);
                    noStroke();
                    ellipse(data.x,data.y,80,80);
                    pop(); // Restore original state
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

        function sendData(event , data) {
            // Send that object to the socket
            // console.log("Sending Data");
            // console.log("socket", socket);

            data = {value: data, room: room_ID}

            // console.log(event, data);
            socket.emit(event, data);
        }

        
        
        return {
            initIO:initIO,
            getSocket:getSocket,
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

export default ioController;
