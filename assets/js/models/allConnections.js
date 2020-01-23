var allConnections = (function() {
    var instance;
    
    function init() {
     
        var _connections = [];
        var selectedConnection;
        var drawConnection = false;
        var compAddConnectionCounter = 0;
        var selectingSecondConnection = false;

        
        function add(connection) {
            _connections.push(connection);
        }

        function length() {
            return _connections.length;
        }
        function get() {
            return _connections;
        }
        function getConnetion(num) {
            return _connections[num];
        }
        function drawAllConnections() {
            if (allCons.getSelectingSecondConnection()) {
                allCons.get().forEach((i) => {
                    i.compSelectDisplay();
                });
            }else {
                allCons.get().forEach((i) => {
                    
                    if (i.getComponents()[0] && i.getComponents()[1]) {
                        //console.log(i.getComponents()[0].getComponentName(), i.getComponents()[1].getComponentName());
                        //console.log(allCons.getSelectedConnection());
                        // Prevents displaying incomplete set connections
                        if (i != allCons.getSelectedConnection()) {
                            
                            // Checks if linking component wishs to hide its connection
                            if (!(i.isHidden())) {
                                i.defaultDisplay();
                            }
                        }
                    }
                });
            }
        }
        function removeConnection(con) {
            var index = _connections.findIndex(c => c === con);
            _connections = _connections.filter((value, i, arr) => {
                return i != index; 
            });
        }
        function getSelectedConnection() {
            return selectedConnection;
        }
        function setSelectedConnection(val) {
            selectedConnection = val;
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
        function selectConnectionForComp(comp) {
            console.log("adding comp to selected connection");
            // getting second connection
            var preComp = selectedConnection.getComponents()[0];
            //comp.setHasConnection(true);
            compAddConnectionCounter++;

            // if user is selecting final component for link
            if (compAddConnectionCounter == 2) {
                //print(checkValidConnection(true, comp, preComp));
                if (checkValidConnection(true, comp, preComp)) {
                    // Adding component to connection object
                    selectedConnection.addComponent(comp);
                } else {
                    // Deleting connection object
                    removeConnection(selectedConnection);

                    // display error message
                    alert("Connection type not possible!");
                }

                // End selection process

                comp.setHasConnection(true);
                preComp.setHasConnection(true);
                drawConnection = false;
                selectingSecondConnection = false;
                selectedConnection = null;
                compAddConnectionCounter=0;
                updateMouseCursor();
            } 
            else if (compAddConnectionCounter == 1) {
                if (checkValidConnection(false, comp, null)) {
                    print("connecting first component");
                    // Second component should now be selected
                    selectingSecondConnection = true;
                    // Adding component to connection object
                    print(comp);
                    selectedConnection.addComponent(comp);
                    
                    // adding connection to list of allCons
                    allCons.add(c);
                } else {
                    // End selection process
                    drawConnection = false;
                    selectingSecondConnection = false;
                    selectedConnection = null;
                    compAddConnectionCounter=0;
                    updateMouseCursor();

                    // Deleting connection object
                    removeConnection(selectedConnection);

                    alert("Connection type not possible!");
                }
            }
            print(get());
        }
        function drawConnetions(xmouse, ymouse) {
            if (selectingSecondConnection == true) {
                selectedConnection.setMousePos(xmouse, ymouse);
            }
        }
        function getConnectionsRelatedToComp(c) {
            var _relatedConnections = [];

            _connections.forEach((i) => {
                if (i != selectedConnection) {
                    if (c == i.getComponents()[0] || c == i.getComponents()[1]) {
                        _relatedConnections.push(i);
                    }
                }
            });
            return _relatedConnections;
        }
        function checkValidConnection(hasSelectedBothComponents, comp, preComp) {
            var isValidConnection = false;
            var isValidConnectionType1 = comp.checkValidLinkingComponent(selectedConnection);
            if (hasSelectedBothComponents) {
                var isValidConnectionType2 = preComp.checkValidLinkingComponent(selectedConnection);
                if (allVRules.isValidConnection(comp.getType(), preComp.getType()) && isValidConnectionType1 && isValidConnectionType2) {
                    isValidConnection = true;
                }
                print(isValidConnectionType2);
            } else {
                if (isValidConnectionType1) {
                    isValidConnection = true;
                }
            }
            print(isValidConnectionType1);
            return isValidConnection;
        }

        return {add:add,
                length:length,
                get:get,
                getConnetion:getConnetion,
                drawAllConnections:drawAllConnections,
                removeConnection:removeConnection,
                getSelectedConnection:getSelectedConnection,
                setSelectedConnection:setSelectedConnection,
                getSelectingSecondConnection:getSelectingSecondConnection,
                selectConnectionForComp:selectConnectionForComp,
                getDrawConnection: getDrawConnection,
                setDrawConnection: setDrawConnection,
                drawConnetions:drawConnetions,
                getConnectionsRelatedToComp:getConnectionsRelatedToComp,
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