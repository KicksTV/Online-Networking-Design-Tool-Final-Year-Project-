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
        function selectConnectionForComp(comp1) {
            console.log("adding comp to selected connection");
            
            // getting second connection
            var comp2 = selectedConnection.getComponents()[0];
            comp1.setHasConnection(true);
            compAddConnectionCounter++;

            if (compAddConnectionCounter == 2) {
                if (allVRules.isValidConnection(comp1.getType(), comp2.getType())) {
                    // Adding component to connection object
                    selectedConnection.addComponent(comp1);
                } else {
                    // Deleting connection object
                    removeConnection(selectedConnection);

                    // display error message
                    print(allVRules.getLastBrokenRule().getWarningMsg());
                }
            } else {
                // Adding component to connection object
                selectedConnection.addComponent(comp1);
            }

            
            if (compAddConnectionCounter == 1) {
                // Second component should now be selected
                selectingSecondConnection = true;
            }
            else if (compAddConnectionCounter == 2) {
                
                // End selection process
                drawConnection = false;
                selectingSecondConnection = false;
                selectedConnection = null;
                compAddConnectionCounter=0;
                updateMouseCursor();
            }
            print(get());
        }
        function drawConnetions(xmouse, ymouse) {
            if (selectingSecondConnection == true) {
                selectedConnection.setMousePos(xmouse, ymouse);
            }
        }
        function getConnectionsRelatedToComp(c) {
            var relatedConnections = [];

            _connections.forEach((i) => {
                if (i != selectedConnection) {
                    if (c == i.getComponents()[0] || c == i.getComponents()[1]) {
                        relatedConnections.push(i);
                    }
                }
            });
            return relatedConnections;
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