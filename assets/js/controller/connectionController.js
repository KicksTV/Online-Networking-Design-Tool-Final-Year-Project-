// Controllers
import networkController from './networkController.js';
import componentController from './componentController.js';

// Collections
import allConnections from '../collections/allConnections.js';
import allVRules from '../collections/allValidationRules.js';

// Models
import Connection from '../models/connection.js';
import Graph from '../models/graph.js';

// Views
import InterfaceView from '../views/InterfaceView.js';

const connectionController = (function() {
    var instance;
    
    function init() {
        var drawConnection = false;
        var compAddConnectionCounter = 0;
        var selectingSecondConnection = false;
        var selectingInterface = false;

        function createNewConnection(name) {
            let newcon = getDefaultComponentData(name);

            return newcon;
        }
        function drawAllConnections() {
            allConnections.getInstance().get().forEach((i) => {
                if (getSelectingSecondConnection() && i == allConnections.getInstance().getSelectedConnection()) {
                    i.compSelectDisplay();
                }else {
                    // Prevents displaying incomplete set connections
                    if (i.getComponents()[0] && i.getComponents()[1]) {
                        if (i.getComponents()[0].image && i.getComponents()[1].image) {
                            // Checks if linking component wishs to hide its connection
                            if (!i.isHidden()) {
                                push(); // Start a new drawing state
                                strokeWeight(2);
                                i.defaultDisplay();
                                pop(); // Restore original state
                            }
                        }
                    }
                }
            });
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
            var preComp = allConnections.getInstance().getSelectedConnection().getComponent(0);

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
                    allConnections.getInstance().removeConnection(allConnections.getInstance());

                    // End selection process
                    endConnection();

                    // display error message
                    $('#warningConnectionToastAlert').toast('show');
                    $('#warningConnectionToastAlert .toast-body').text(
                        "Connection not possible!"
                    );
                }               
            } 
            else if (compAddConnectionCounter == 1) {
                if (checkValidConnection(false, comp, null)) {
                    // print("connecting first component");
                    //print(comp.hasAvailablePort());

                    // NEED TO CHANGE THIS!!!
                    if (comp.hasAvailablePort()) {
                        // print("waiting for selection of components");
                        waitForSelectedPort(comp.getInterfaces(), comp, null);
                        selectingInterface = true;
                    } else {
                        $('#warningConnectionToastAlert').toast('show');
                        $('#warningConnectionToastAlert .toast-body').text(
                            "No Available Ports!"
                        );
                    }
                } else {
                    endConnection();
                    // Deleting connection object
                    allConnections.getInstance().removeConnection(allConnections.getInstance());

                    $('#warningConnectionToastAlert').toast('show');
                    $('#warningConnectionToastAlert .toast-body').text(
                        "Connection not possible!"
                    );
                }
            }
            
            //print(get());
        }

        function addComponentToConnection(comp, interfaceValues) {
            // Adding component to connection object
            let connection = allConnections.getInstance().getSelectedConnection();
            connection.addComponent(comp);
            connection.addInterfacePort(interfaceValues);
        }
        function drawConnetions(xmouse, ymouse) {
            if (selectingSecondConnection == true) {
                allConnections.getInstance().getSelectedConnection().setMousePos(xmouse, ymouse);
            }
        }
        function deleteConnection(comp) {
            var connectionsToDel = allConnections.getInstance().getConnectionsRelatedToComp(comp);
            connectionsToDel.forEach((con) => {
                allConnections.getInstance().removeConnection(con);
                let nextComp = con.getComponents().find(thisComp => thisComp.id !== comp.id);
                // print("nextComp", nextComp);
                let index = con.getComponents().indexOf(nextComp);
                componentController.getInstance().makePortAvailable(nextComp, con.getInterfacePort(index));
            });
        }
        function checkValidConnection(hasSelectedBothComponents, comp, preComp) {
            // print(allConnections.getInstance().getSelectedConnection());
            
            var isValidConnection = false;
            var isValidConnectionType1 = comp.checkValidLinkingComponent(allConnections.getInstance().getSelectedConnection());
            
            // NEEDS TO BE PROPERLY FIXED
            if (preComp == null) {
                hasSelectedBothComponents = false;
            }
            
            if (hasSelectedBothComponents) {
                var isValidConnectionType2 = preComp.checkValidLinkingComponent(allConnections.getInstance().getSelectedConnection());
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
            var interfaceView = new InterfaceView(interfaces);
            interfaceView.create();
            interfaceView.show(winMouseX, winMouseY);

            selectingSecondConnection = false;

            $('#connectionCancel').on('click', function(event) {
                // Deleting connection object
                allConnections.getInstance().removeConnection(allConnections.getInstance());
                endConnection();
                interfaceView.hide();
                interfaceView.clear();

                selectingInterface = false;
            });
                
            $('.portButton').on('click', function(event){
                // print("Selected port", this.value);
                var interfaceValues = comp.getInterfaceFromString(this.value);

                // print("interfaceValues: ", interfaceValues);
                
                addComponentToConnection(comp, interfaceValues);

                if(compAddConnectionCounter == 1) {
                    // Second component should now be selected
                    selectingSecondConnection = true;

                    // adding connection to list of allCons
                    allConnections.getInstance().add(allConnections.getInstance().getSelectedConnection());

                } else {
                    allConnections.getInstance().getSelectedConnection().getInterface(0).subtractPossibleAvailablePort();
                    allConnections.getInstance().getSelectedConnection().getInterface(1).subtractPossibleAvailablePort();

                    // Creating new Edge on graph
                    Graph.getInstance().addEdge(
                        allConnections.getInstance().getSelectedConnection().getComponent(0).getID(), 
                        allConnections.getInstance().getSelectedConnection().getComponent(1).getID()
                    );

                    endConnection();
                }

                selectingInterface = false;

                interfaceView.hide();

                // get the interface.
                var inter= interfaceValues[0];
                // get the port of that interface.
                var port = interfaceValues[1];
                // port is now in use and cannot be selected.
                inter.portInUse(port);

                interfaceView.clear();


                // Triggering networkChangeEvent
                networkController.getInstance().dispatchNetworkChangeEvent();
                //compPropertiesGUIContainer.dispatchEvent(networkChangeEvent);

                if (preComp != null) {
                    $('#finishedConnectionToastAlert').toast('show');
                    $('#finishedConnectionToastAlert .toast-body').text(
                        "Now linked " + preComp.displayName + "  ---->  " + comp.displayName + "."
                    );
                }
            });
        }
        function endConnection() {
            // End selection process

            drawConnection = false;
            selectingSecondConnection = false;
            allConnections.getInstance().setSelectedConnection(null);
            compAddConnectionCounter=0;
            //updateMouseCursor();
        }

        function toJSON() {
            var json = [];
            allConnections.getInstance().get().forEach((con) => {
                json.push(con.prepareForJson());
            });
            return json;
        }

        async function getDefaultComponentData(name) {
            
            let promise = new Promise((resolve, reject) => {
                app.loadXML(`/assets/components/${name.toLowerCase()}.xml`, (xml) => {
                    resolve(xml);
                });
            });
            let data = await promise;
            let type = data.getChild('type').getContent();
            var defaultComponent = new Connection(null, name, type);
            return defaultComponent;
        }

        return {
            createNewConnection:createNewConnection,
            drawAllConnections:drawAllConnections,
            getSelectingSecondConnection:getSelectingSecondConnection,
            isSelectingInterfacePort:isSelectingInterfacePort,
            selectConnectionForComp:selectConnectionForComp,
            getDrawConnection: getDrawConnection,
            setDrawConnection: setDrawConnection,
            drawConnetions:drawConnetions,
            deleteConnection:deleteConnection,
            endConnection:endConnection,
            toJSON:toJSON,
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

export default connectionController;