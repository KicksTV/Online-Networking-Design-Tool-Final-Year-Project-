import componentController from './componentController.js';
import saveLoadController from './saveLoadController.js';
import allComponents from '../collections/allComponents.js';
import Graph from '../models/graph.js';


const ioController = (function() {
    var instance;
    
    function init() {
     
        var io = require('socket.io-client')
        var socket;


        function initIO() {
            socket = io.connect(`http://localhost:5000/?clientId=${clientId}`);

            // We make a named event called 'createComponent' and write an
            // anonymous callback function
            socket.on('connection', 
                async function(data) {
                    console.log("new client connected");

                    let json = await saveLoadController.getInstance().saveEventToJSON();
                    console.log(json);
                    if (json != null) {
                        sendData('sentCanvasData', json);
                    }
                }
            );

            socket.on('receivedCanvasData', 
                async function(data) {
                    console.log("Got canvas data", data);

                    // let json = await saveLoadController.getInstance().saveEventToJSON();
                    // console.log(json);
                    saveLoadController.getInstance().loadProject(data);
                    // sendData('sentCanvasData', json);
                }
            );

            socket.on('createComponent',
                async function(data) {
                    // console.log("Got:", data);

                    let defaultComponent = await componentController.getInstance().createNewComponent(data.name);

                    var newcomp = Object.assign(defaultComponent, data);

                    // ADDS IT TO ARRAY OF ALL components
                    allComponents.getInstance().add(newcomp);

                    // Adds component to graph
                    Graph.getInstance().addNode(newcomp.id);
                }
            );
            socket.on('componentMove',
                async function(data) {
                    // console.log("Got:", data);
                    var foundComponent = allComponents.getInstance().getAll().find(c => c.id == data.id);
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
                    var foundComponent = allComponents.getInstance().getAll().find(c => c.id == data.id);

                    var newcomp = Object.assign(foundComponent, data);

                    newcomp.image.width = data.width;
                    newcomp.image.height = data.height;

                    allComponents.getInstance().getAll().map(item => item.id === data.id ? newcomp : item);
                }
            );
        }
        function sendData(event , data) {
            // Send that object to the socket
            // console.log("Sending Data");
            socket.emit(event, data);
        }

        
        
        return {
            initIO:initIO,
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
