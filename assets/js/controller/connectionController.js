// Controllers
import networkController from './networkController.js';
import componentController from './componentController.js';
import p5Controller from './p5Controller.js';

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
            allConnections.get().forEach((con) => {
                if (getSelectingSecondConnection() && con == allConnections.getSelectedConnection()) {
                    con.compSelectDisplay();
                }else {
                    // Prevents displaying incomplete set connections
                    if (con.getComponents()[0] && con.getComponents()[1]) {
                        if (con.getComponents()[0].image && con.getComponents()[1].image) {
                            // Checks if linking component wishs to hide its connection
                            if (!con.isHidden()) {
                                push(); // Start a new drawing state
                                strokeWeight(2);
                                con.defaultDisplay();
                                pop(); // Restore original state

                                displayCompIPaddress(con)
                            }
                        }
                    }
                }
            });
        }
        function displayCompIPaddress(connection) {
            let comp1 = connection.getComponent(0);
            let comp2 = connection.getComponent(1);

            let ipaddresses = [connection.getIPaddress(0), connection.getIPaddress(1)]
            if (!_.isEqual(ipaddresses, ["", ""])) {
                for (var i=0;i<=1;i++) {
                    // get x & y coords of both components
                    let center1 = comp1.getCenterPos();
                    let center2 = comp2.getCenterPos();

                    let x1 = center1[0], 
                        x2 = center2[0],
                        y1 = center1[1], 
                        y2 = center2[1];

                    // Gets the position which is a quarter between the two components
                    let quarterX = connection.getComponent(i) == comp1 ? lerp(x1, x2, 0.25) : lerp(x1, x2, 0.75);
                    let quarterY = connection.getComponent(i) == comp1 ? lerp(y1, y2, 0.25) : lerp(y1, y2, 0.75);
                    let d = dist(x1, y1, x2, y2);

                    let angle = x1 < x2 ? atan2(y2 - y1, x2 - x1) : atan2(y1 - y2, x1 - x2);

                    // Will only show if distance is greater than 250
                    if (d > 250) {
                        push();
                        translate(quarterX, quarterY);
                        rotate(angle);
                        text(ipaddresses[i], 0, -5);
                        pop();
                    }
                }
            }
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
                    allConnections.removeConnection(allConnections);

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
            var interfaceView = new InterfaceView(interfaces);
            interfaceView.create();
            interfaceView.show(winMouseX, winMouseY);

            selectingSecondConnection = false;

            $('#connectionCancel').on('click', function(event) {
                // Deleting connection object
                allConnections.removeConnection(allConnections);
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

                interfaceView.hide();

                // get the interface.
                var inter= interfaceValues[0];
                // get the port of that interface.
                var port = interfaceValues[1];
                // port is now in use and cannot be selected.
                inter.portInUse(port);

                interfaceView.clear();


                // Triggering networkChangeEvent
                networkController.dispatchNetworkChangeEvent();
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
            allConnections.setSelectedConnection(null);
            compAddConnectionCounter=0;
            //updateMouseCursor();
        }

        function toJSON() {
            var json = [];
            allConnections.get().forEach((con) => {
                json.push(con.prepareForJson());
            });
            return json;
        }

        async function getDefaultComponentData(name) {
            
            let promise = new Promise((resolve, reject) => {
                p5Controller.getCanvas().loadXML(`/assets/components/${name.toLowerCase()}.xml`, (xml) => {
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
            displayCompIPaddress:displayCompIPaddress,
            getSelectingSecondConnection:getSelectingSecondConnection,
            isSelectingInterfacePort:isSelectingInterfacePort,
            selectConnectionForComp:selectConnectionForComp,
            getDrawConnection: getDrawConnection,
            setDrawConnection: setDrawConnection,
            addComponentToConnection:addComponentToConnection,
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

export default connectionController.getInstance();