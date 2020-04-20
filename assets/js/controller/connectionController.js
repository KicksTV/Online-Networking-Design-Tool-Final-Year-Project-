var connectionController = (function() {
    var instance;
    
    function init() {
     
        var drawConnection = false;
        var compAddConnectionCounter = 0;
        var selectingSecondConnection = false;
        var selectingInterface = false;

        function createNewConnection(type) {
            var newcon = new Con(type);
            return newcon;
        }
        function drawAllConnections() {
            if (getSelectingSecondConnection()) {
                allConnections.getInstance().get().forEach((i) => {
                    i.compSelectDisplay();
                });
            }else {
                allConnections.getInstance().get().forEach((i) => {
                    if (i.getComponents()[0] && i.getComponents()[1]) {
                        // Prevents displaying incomplete set connections
                        if (i != allConnections.getInstance()) {
                            
                            // Checks if linking component wishs to hide its connection
                            if (!(i.isHidden())) {
                                push(); // Start a new drawing state
                                strokeWeight(2);
                                i.defaultDisplay();
                                pop(); // Restore original state
                            }
                        }
                    }
                });
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
            console.log("adding comp to selected connection");

            // getting second connection
            compAddConnectionCounter++;
            print("ConCounter" + compAddConnectionCounter);

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
                    print("connecting first component");
                    //print(comp.hasAvailablePort());

                    // NEED TO CHANGE THIS!!!
                    if (comp.hasAvailablePort()) {
                        print("waiting for selection of components");
                        waitForSelectedPort(comp.getInterfaces(), comp, null);
                        selectingInterface = true;
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
            //print(comp);
            // Adding component to connection object
            allConnections.getInstance().getSelectedConnection().addComponent(comp);
            allConnections.getInstance().getSelectedConnection().addInterfacePort(interfaceValues);
        }
        function drawConnetions(xmouse, ymouse) {
            if (selectingSecondConnection == true) {
                allConnections.getInstance().getSelectedConnection().setMousePos(xmouse, ymouse);
            }
        }
        function checkValidConnection(hasSelectedBothComponents, comp, preComp) {
            var isValidConnection = false;
            var isValidConnectionType1 = comp.checkValidLinkingComponent(allConnections.getInstance().getSelectedConnection());
            
            // NEEDS TO BE PROPERLY FIXED
            if (preComp == null) {
                hasSelectedBothComponents = false;
            }
            
            if (hasSelectedBothComponents) {
                var isValidConnectionType2 = preComp.checkValidLinkingComponent(allConnections.getInstance().getSelectedConnection());
                if (allVRules.isValidConnection(comp.getType(), preComp.getType()) && isValidConnectionType1 && isValidConnectionType2) {
                    isValidConnection = true;
                }
                //print(isValidConnectionType2);
            } else {
                if (isValidConnectionType1) {
                    isValidConnection = true;
                }
            }
            //print(isValidConnectionType1);
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
                //print(this.value);
                var interfaceValues = comp.getInterfaceFromString(this.value);
                
                addComponentToConnection(comp, interfaceValues);

                if(compAddConnectionCounter == 1) {
                    // Second component should now be selected
                    selectingSecondConnection = true;

                    // adding connection to list of allCons
                    allConnections.getInstance().add(allConnections.getInstance().getSelectedConnection());
                } else {
                    allConnections.getInstance().getSelectedConnection().getInterface(0).subtractPossibleAvailablePort();
                    allConnections.getInstance().getSelectedConnection().getInterface(1).subtractPossibleAvailablePort();
                    endConnection();
                }

                selectingInterface = false;

                interfaceView.hide();

                // get the interface.
                var interface = interfaceValues[0];
                // get the port of that interface.
                var port = interfaceValues[1];
                // port is now in use and cannot be selected.
                interface.portInUse(port);

                interfaceView.clear();


                // Triggering networkChangeEvent
                networkPropertiesGUIContainer.dispatchEvent(networkChangeEvent);
                compPropertiesGUIContainer.dispatchEvent(networkChangeEvent);

                if (preComp != null) {
                    $('#finishedConnectionToastAlert').toast('show');
                    $('#finishedConnectionToastAlert .toast-body').text(
                        "Now linked " + preComp.getComponentName() + "  ---->  " + comp.getComponentName() + "."
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
            updateMouseCursor();
        }

        return {
                drawAllConnections:drawAllConnections,
                getSelectingSecondConnection:getSelectingSecondConnection,
                isSelectingInterfacePort:isSelectingInterfacePort,
                selectConnectionForComp:selectConnectionForComp,
                getDrawConnection: getDrawConnection,
                setDrawConnection: setDrawConnection,
                drawConnetions:drawConnetions,
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