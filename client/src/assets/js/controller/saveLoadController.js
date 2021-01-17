// Controllers
import connectionController from './connectionController.js';
import componentController from './componentController.js';
import networkController from './networkController.js';
import p5Controller from './p5Controller.js';

// Collections
import allComponents from '../collections/allComponents.js';
import allConnections from '../collections/allConnections.js';
import allSubnets from '../collections/allSubnets.js';

// Models
import Graph from '../models/graph.js';
import Subnet from '../models/Subnet.js';
import Interface from '../models/Interface.js';

const p5 = require('p5')


const saveLoadController = (function() {
    var instance;
    
    function init() {

        function init() {
            var canvasLoadProject = document.getElementById("canvasLoadProject");
            var canvasSaveProject = document.getElementById("canvasSaveProject");

            // LOAD
            var input = document.getElementById("upload_input");
            canvasLoadProject.addEventListener("click", () => {
                input.click();
            });
            input.onchange = loadEvent;
            // SAVE
            canvasSaveProject.addEventListener("click", saveEventToFile);
        }

        async function saveEventToFile() {
            // Setup of json format
            var json = {
                "graph": {},
                "connections": [],
                "components": [],
                "subnets": [],
            };
            // Checking if anything exists on canvas
            if (!allComponents.isEmpty()) {

                var data = await getAllSaveData();

                json.graph = data[0];
                json.connections = data[1];
                json.components = data[2];
                json.subnets = data[3];

                // Saves json to file
                // console.log(json);
                return p5Controller.getCanvas().saveJSON(json, 'network_design_project.json');
            }else {
                alert("Canvas is empty");
            }
        }

        async function saveEventToJSON() {
            // Setup of json format
            var json = {
                "graph": {},
                "connections": [],
                "components": [],
                "subnets": [],
            };
            // Checking if anything exists on canvas
            if (!allComponents.isEmpty()) {

                var data = await getAllSaveData();

                json.graph = data[0];
                json.connections = data[1];
                json.components = data[2];
                json.subnets = data[3];

                // Saves json to file
                // console.log(json);
                return json;
            }else {
                return null;
            }
        }

        async function getAllSaveData() {
            var graphData = Graph.getInstance().toJSON();
            var connectionData = connectionController.toJSON();
            var componentData = componentController.toJSON();
            var subnetData = networkController.toJSON();
    
            return Promise.all([graphData, connectionData, componentData, subnetData]);
        }

        function loadEvent(evt) {
            var result = evt.target;
            if ('files' in result) {
                if (result.files.length == 0) {
                    // user didnt select file
                }else {
                    var files = result.files;
                    // loops all selected files or file
                    for (var i=0; i < files.length-1; i++) {
                        var f = files[i];
                        var reader = new FileReader();

                        // Only process json files.
                        if (!f.type.match('json.*')) {
                            alert("Not JSON File!");
                            continue;
                        }

                        // Closure to capture the file information.
                        reader.onload = (function() {
                            return function(e) {
                                console.log("running loadJSON");
                                p5.loadJSON(e.target.result, loadProject);
                            };
                        })(f);

                        reader.onerror = (evt) => {
                            if(evt.target.error.name == "NotReadableError") {
                                // The file could not be read
                                console.log("file could not be read");
                            }
                        }
                        reader.readAsDataURL(f);
                    }
                }
            }
        }

        // PROJECT LOADING FUNCTION
        // First running 'loadProject' will load subnets and components
        // Once 'loadComponents' is finished, it will callback 'loadProject'
        // Second time running will load connections
        async function loadProject(array) {
            // if (! loadedComponents) {
                // Callback to this function when finished loading components
                await loadComponents(array, loadProject);
            // } 
            // else if (loadedComponents) {

                // LOADING SAVED SUBNETS
                array.subnets.forEach(s => {
                    let newSub = new Subnet()
                    newSub = cloneObject(s, newSub);
                    let endDevices = [];
                    for (var id of s.endDevices) {
                        let foundComp = allComponents.getAll().find(comp => comp.id === id);
                        endDevices.push(foundComp);
                    }
                    newSub.setEndDevices(endDevices);
                    allSubnets.getInstance().add(newSub);
                });


                await loadConnections(array);

                window.setTimeout(() => {
                    console.log("Check network event");
                    networkController.dispatchNetworkChangeEvent();
                }, 500);
            // }
        }
        async function loadComponents(array) {
            // LOADING COMPONENTS
            for (let comp of array.components) {
                    var  newcomp = await componentController.createNewComponent(comp.name);
                    newcomp = Object.assign(newcomp, comp);

                    // Setting size of the component
                    newcomp.image.resize(comp.width, comp.height);

                    allComponents.add(newcomp);

                    // Adds component to graph
                    Graph.getInstance().addNode(newcomp.id);

            }
            return true;
        }
        async function loadConnections(array) {
            // LOADING CONNECTIONS
            for (let con of array.connections) {
                // new connection
                var newconnection = await connectionController.createNewConnection(con.name);
                newconnection.id = con.id;
                newconnection.setMousePos(con.mousePos[0], con.mousePos[1]);

                // Creates the interfaces
                con._interfacePorts.forEach((ip) => {
                    var index = con._interfacePorts.indexOf(ip);

                    // print(ip[0].portType, ip[0].numberOfPorts);

                    newconnection.addInterfacePort([new Interface(null, ip[0].portType, ip[0].numberOfPorts), ip[1]]);
                    Object.assign(newconnection.getInterface(index), ip[0]);
                });
                
                // Wait for components to be added to connection
                let promise = new Promise((resolve) => {
                    const loadCompsToConnection = (newconnection) => {
                        // looping through all the components in the connection
                        for (let savedComp of con._components) {
                            
                            let foundComp = allComponents.getAll().find(nextComp => nextComp.id == savedComp);
                                
                            // comp has a connection
                            foundComp.setHasConnection(true);
                            // add comps interfaces

                            console.log("index", con._components.indexOf(savedComp));
                            console.log("interface ports", newconnection._interfacePorts);
                            console.log(newconnection.id);

                            foundComp.injectInterfaceSavedData(newconnection.getInterface(con._components.indexOf(savedComp)));
                            newconnection.addComponent(foundComp);

                        }
                        return newconnection;
                    }
                    
                    resolve(loadCompsToConnection(newconnection));
                });
                newconnection = await promise;
                console.log("adding saved connection");

                // Creating new Edge on graph	
                Graph.getInstance().addEdge(	
                    newconnection.getComponent(0).id, 	
                    newconnection.getComponent(1).id	
                );

                allConnections.add(newconnection);
            }

            return true;
        }

        function cloneObject(srcObj, targetObj) {
            // goes through all attributes of obj and copies its value
            for (let key in srcObj) {
                targetObj[key] = srcObj[key] 
            }
            return targetObj;
        }
        
        return {
            init:init,
            saveEventToFile:saveEventToFile,
            saveEventToJSON:saveEventToJSON,
            loadEvent:loadEvent,
            loadProject:loadProject,
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

export default saveLoadController.getInstance();
