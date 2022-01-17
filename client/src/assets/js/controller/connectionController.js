// Controllers
import networkController from './networkController.js';
import componentController from './componentController.js';
import panelController from './panelController.js';
import p5Controller from './p5Controller.js';

// Collections
import allConnections from '../collections/allConnections.js';
import allVRules from '../collections/allValidationRules.js';

// Models
import Connection from '../models/connection.js';
import Graph from '../models/graph.js';

const connectionController = (function() {
    var instance;
    
    function init() {
        var drawConnection = false;
        var compAddConnectionCounter = 0;
        var selectingSecondConnection = false;
        var selectingInterface = false;

        function connectionEvent(mouseX, mouseY) {
            console.log("here", mouseX, mouseY)
            componentController.checkForSelectedComponent(mouseX, mouseY);
            if (componentController.isCurrentlyClickingComp() != null) {
                // NEED TO CHANGE HOW THIS WORKS - PREVENTS INTERACTION WITH CANVAS WHILE SELECTING INTERFACE
                if (! isSelectingInterfacePort()) {
                    componentController.setSelectedComponent(componentController.getSelectedComponent());
        
                    // Adds connection data to table
                    panelController.getInstance().updatePanelWithData(componentController.getSelectedComponent());
                    
                    // Checks if users is selecting two components to make a connection
                    if (getDrawConnection()) {
                        selectConnectionForComp(componentController.getSelectedComponent());
                    }
                }
            }        
        }
        function createNewConnection(name) {
            let newcon = getDefaultComponentData(name);
            return newcon;
        }
        function getAll() {
            return allConnections.getAll()
        }
        function add(con) {
            return allConnections.add(con)
        }
        function clear() {
            allConnections.clear()
        }
        function getDrawConnection() {
            return drawConnection;
        }
        function setDrawConnection(val) {
            drawConnection = val;
        }
        function getSelectingSecondConnection() {
            return selectingSecondConnection;
        }
        function isSelectingInterfacePort() {
            return selectingInterface;
        }
        function selectConnectionForComp(comp) {

            if (compAddConnectionCounter > 2) {
                return;
            }
            // console.log("adding comp to selected connection");

            // getting second connection
            compAddConnectionCounter++;
            // print("ConCounter" + compAddConnectionCounter);

            // if user is selecting final component for link
            if (compAddConnectionCounter == 2) {
            var preComp = allConnections.getSelectedConnection().getComponent(0);

                //print(checkValidConnection(true, comp, preComp));
                if (checkValidConnection(true, comp, preComp)) {
                    
                    if (comp.hasAvailablePort()) {
                        waitForSelectedPort(comp.getInterfaces(), comp, preComp);
                        selectingInterface = true;
                    }
                    comp.setHasConnection(true);
                    
                    if (typeof preComp !== 'undefined') {
                        preComp.setHasConnection(true);
                    }
                    
                } else {
                    // print("ending connection");

                    // Deleting connection object
                    allConnections.removeConnection(allConnections);

                    // End selection process
                    endConnection();

                    // display error message
                    // $('#warningConnectionToastAlert').toast('show');
                    // $('#warningConnectionToastAlert .toast-body').text(
                    //     "Connection not possible!"
                    // );
                    window.$vue.makeToast("Error", "Connection not possible!", true)
                }               
            } 
            else if (compAddConnectionCounter == 1) {
                // console.log("check valid", checkValidConnection(false, comp, null))
                if (checkValidConnection(false, comp, null)) {
                    // print("connecting first component");
                    //print(comp.hasAvailablePort());

                    // NEED TO CHANGE THIS!!!
                    if (comp.hasAvailablePort()) {
                        // print("waiting for selection of components");
                        waitForSelectedPort(comp.getInterfaces(), comp, null);
                        selectingInterface = true;
                    } else {
                        // $('#warningConnectionToastAlert').toast('show');
                        // $('#warningConnectionToastAlert .toast-body').text(
                        //     "No Available Ports!"
                        // );
                        window.$vue.makeToast("Error", "No Available Ports!", true)
                    }
                } else {
                    endConnection();
                    // Deleting connection object
                    allConnections.removeConnection(allConnections);
                    // $('#warningConnectionToastAlert').toast('show');
                    // $('#warningConnectionToastAlert .toast-body').text(
                    //     "Connection not possible!"
                    // );
                    window.$vue.makeToast("Error", "Connection not possible!", true)
                }
            }
            
            //print(get());
        }

        function addComponentToConnection(comp, interfaceValues) {
            // Adding component to connection object
            let connection = allConnections.getSelectedConnection();
            connection.addComponent(comp);
            connection.addInterfacePort(interfaceValues);
        }
        function drawConnetions(xmouse, ymouse) {
            if (selectingSecondConnection == true) {
                allConnections.getSelectedConnection().setMousePos(xmouse, ymouse);
            }
        }
        function deleteConnection(comp) {
            var connectionsToDel = allConnections.getConnectionsRelatedToComp(comp);
            connectionsToDel.forEach((con) => {
                allConnections.removeConnection(con);
                let nextComp = con.getComponents().find(thisComp => thisComp.id !== comp.id);
                // print("nextComp", nextComp);
                let index = con.getComponents().indexOf(nextComp);
                componentController.makePortAvailable(nextComp, con.getInterfacePort(index));
            });
        }
        function checkValidConnection(hasSelectedBothComponents, comp, preComp) {
            // print(allConnections.getSelectedConnection());
            
            var isValidConnection = false;
            var isValidConnectionType1 = comp.checkValidLinkingComponent(allConnections.getSelectedConnection());

            // console.log("Valid linking component", isValidConnectionType1);
            
            // NEEDS TO BE PROPERLY FIXED
            if (preComp == null) {
                hasSelectedBothComponents = false;
            }
            
            if (hasSelectedBothComponents) {
                var isValidConnectionType2 = preComp.checkValidLinkingComponent(allConnections.getSelectedConnection());
                if (allVRules.getInstance().isValidConnection(comp.name, preComp.name) && isValidConnectionType1 && isValidConnectionType2) {
                    isValidConnection = true;
                }
                //print(isValidConnectionType2);
            } else {
                if (isValidConnectionType1) {
                    isValidConnection = true;
                }
            }
            // print("is valid connection: " + isValidConnectionType1);
            return isValidConnection;
        }
        function waitForSelectedPort(interfaces, comp, preComp) {
            
            p5Controller.getCanvas().createInterfaceView(interfaces);
            selectingSecondConnection = false;
            document.getElementById('connectionCancel').onclick = () => {
                // Deleting connection object
                console.log("cancel")
                allConnections.removeConnection(allConnections);
                endConnection();
                p5Controller.getCanvas().clearInterfaceView();
                selectingInterface = false;
                window.$vue.makeToast("Canceled Connection", "", true)
            }
                
            document.getElementsByClassName('portButton').forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    // print("Selected port", this.value);
                    var val = e.target.attributes['value'].value
                    var interfaceValues = comp.getInterfaceFromString(val);
    
                    // print("interfaceValues: ", interfaceValues);
                    
                    addComponentToConnection(comp, interfaceValues);
    
                    if(compAddConnectionCounter == 1) {
                        // Second component should now be selected
                        selectingSecondConnection = true;
    
                        // adding connection to list of allCons
                        allConnections.add(allConnections.getSelectedConnection());
    
                    } else {
                        allConnections.getSelectedConnection().getInterface(0).subtractPossibleAvailablePort();
                        allConnections.getSelectedConnection().getInterface(1).subtractPossibleAvailablePort();
    
                        // Creating new Edge on graph
                        Graph.getInstance().addEdge(
                            allConnections.getSelectedConnection().getComponent(0).getID(), 
                            allConnections.getSelectedConnection().getComponent(1).getID()
                        );
    
                        endConnection();
                    }
    
                    selectingInterface = false;
    
                    p5Controller.getCanvas().hideInterfaceView();
    
                    // get the interface.
                    var inter= interfaceValues[0];
                    // get the port of that interface.
                    var port = interfaceValues[1];
                    // port is now in use and cannot be selected.
                    inter.portInUse(port);
    
                    p5Controller.getCanvas().clearInterfaceView();
    
    
                    // Triggering networkChangeEvent
                    networkController.dispatchNetworkChangeEvent();
                    //compPropertiesGUIContainer.dispatchEvent(networkChangeEvent);
    
                    if (preComp != null) {
                        // $('#finishedConnectionToastAlert').toast('show');
                        // $('#finishedConnectionToastAlert .toast-body').text(
                        //     "Now linked " + preComp.displayName + "  ---->  " + comp.displayName + "."
                        // );
                    }
                })
            })
        }
        function endConnection() {
            // End selection process
            drawConnection = false;
            selectingSecondConnection = false;
            allConnections.setSelectedConnection(null);
            compAddConnectionCounter=0;
            //updateMouseCursor();

            // Now use default mouse press event
            p5Controller.setMousePressedEvent(null)
        }

        function toJSON() {
            var json = [];
            allConnections.get().forEach((con) => {
                json.push(con.prepareForJson());
            });
            return json;
        }

        async function getDefaultComponentData(name) {
            let promise = new Promise((resolve) => {
                p5Controller.getCanvas().loadXML(`/components/${name.toLowerCase()}.xml`, (xml) => {
                    resolve(xml);
                });
            });
            let data = await promise;
            let type = data.getChild('type').getContent();
            name = name.replace('-cable', '')
            var defaultComponent = new Connection(null, name, type);
            return defaultComponent;
        }

        return {
            connectionEvent:connectionEvent,
            getAll:getAll,
            add:add,
            clear:clear,
            toJSON:toJSON,
            createNewConnection:createNewConnection,
            getSelectingSecondConnection:getSelectingSecondConnection,
            isSelectingInterfacePort:isSelectingInterfacePort,
            selectConnectionForComp:selectConnectionForComp,
            getDrawConnection: getDrawConnection,
            setDrawConnection: setDrawConnection,
            addComponentToConnection:addComponentToConnection,
            drawConnetions:drawConnetions,
            deleteConnection:deleteConnection,
            endConnection:endConnection,
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

export default connectionController.getInstance();