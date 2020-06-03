import componentController from './componentController.js';
import allComponents from '../collections/allComponents.js';
import Graph from '../models/graph.js';


const ioController = (function() {
    var instance;
    
    function init() {
     
        var io = require('socket.io-client')
        var socket;


        function initIO() {
            socket = io.connect('http://localhost:5000');

            // We make a named event called 'mouse' and write an
            // anonymous callback function
            socket.on('mouse',
                function(data) {
                    console.log("Got: " + data.x + " " + data.y);
                    push(); // Start a new drawing state
                    // Draw a blue circle
                    fill(0,0,255);
                    noStroke();
                    ellipse(data.x,data.y,80,80);
                    pop(); // Restore original state
                }
            );
    
            socket.on('createComponent',
                async function(data) {
                    console.log("Got:", data);

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
                    console.log("Got:", data);

                    var foundComponent = allComponents.getInstance().getAll().find(c => c.id == data.id);
                    console.log(foundComponent);
                    foundComponent.move(data.x, data.y);
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

            console.log(socket);

        }
        function sendData(event , data) {
            // Send that object to the socket
            console.log("Sending Data");
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
