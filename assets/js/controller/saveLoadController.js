var saveLoadController = (function() {
    var instance;
    
    function init() {
     

        async function saveEvent() {
            // Setup of json format
            var json = {
                "graph": {},
                "connections": [],
                "components": [],
                "subnets": [],
            };
            // Checking if anything exists on canvas
            if (!allComps.isEmpty()) {

                var data = await getAllSaveData();

                json.graph = data[0];
                json.connections = data[1];
                json.components = data[2];
                json.subnets = data[3];

                // Saves json to file
                console.log(json);
                return saveJSON(json, 'network_design_project.json');
            }else {
                alert("Canvas is empty");
            }
        }

        async function getAllSaveData() {
            var graphData = Graph.getInstance().toJSON();
            var connectionData = connectionController.getInstance().toJSON();
            var componentData = componentController.getInstance().toJSON();
            var subnetData = networkController.getInstance().toJSON();
    
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
                    for (var i=0, f;f = files[i]; i++) {
                        var reader = new FileReader();

                        // Only process json files.
                        if (!f.type.match('json.*')) {
                            alert("Not JSON File!");
                            continue;
                        }

                        // Closure to capture the file information.
                        reader.onload = (function(theFile) {
                            return function(e) {
                                console.log("running loadJSON");
                                loadJSON(e.target.result, loadProject);
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
        function loadProject(array, loadedComponents) {
            if (! loadedComponents) {
                // LOADING SAVED SUBNETS
                array.subnets.forEach(s => {
                    let newSub = new Subnet()
                    newSub = cloneObject(s, newSub)
                    allSubnets.getInstance().add(newSub);
                });

                // Callback to this function when finished loading components
                loadComponents(array, loadProject);
            } 
            else if (loadedComponents) {

                loadConnections(array);

                window.setTimeout(() => {
                    print("Check network event");
                    gui.domElement.dispatchEvent(networkChangeEvent)
                }, 500);
            }
        }
        function loadComponents(array, callback) {
            // LOADING COMPONENTS
            for (let comp of array.components) {
                loadImage(comp.imgPath, img => {
                    var  newcomp = compContrInstance.createNewComponent(comp.id, comp.type, comp.imgPath, img);
                    newcomp = Object.assign(newcomp, comp);
                    // Setting size of the component

                    newcomp.image.resize(comp.width, comp.height);

                    allComps.add(newcomp);

                    // Checks if all components have been loaded.
                    // If so, load rest of the saved data.
                    if (array.components.length == allComps.length()) {
                        callback(array, true);
                    }
                });
            }
        }
        function loadConnections(array) {
            // LOADING CONNECTIONS
            for (let con of array.connections) {
                // new connection
                var newconnection = connectionController.getInstance().createNewConnection(con.id, con.type);
                newconnection.setMousePos(con.mousePos[0], con.mousePos[1]);

                // Creates the interfaces
                con._interfacePorts.forEach((ip) => {
                    var index = con._interfacePorts.indexOf(ip);
                    newconnection.addInterfacePort([new Interface(), ip[1]]);
                    Object.assign(newconnection.getInterface(index), ip[0]);
                });
                
                // looping through all the components in the connection
                for (let savedComp of con._components) {
                    
                    let foundComp = allComps.getAll().find(nextComp => nextComp.id == savedComp);
                        
                    // comp has a connection
                    foundComp.setHasConnection(true);
                    // add comps interfaces
                    foundComp.injectInterfaceSavedData(newconnection.getInterface(con._components.indexOf(savedComp)));
                    newconnection.addComponent(foundComp);

                }
                print("adding saved connection");

                // Creating new Edge on graph	
                Graph.getInstance().addEdge(	
                    newconnection.getComponent(0).id, 	
                    newconnection.getComponent(1).id	
                );

                allConnections.getInstance().add(newconnection);
            }
        }
        
        return {
            saveEvent:saveEvent,
            loadEvent:loadEvent,
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