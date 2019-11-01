var allConnections = (function() {
    var instance;
    
    function init() {
     
        var _connections = [];
        var selectedConnection;
        var drawConnection = false;
        var compAddConnectionCounter = 0;
        var selectingSecondConnection = false;

        
        function add(connection) {
            selectedConnection = connection;
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
        function removeConnection(con) {
            var index = _connections.findIndex(c => c === con);
            _connections = _connections.filter((value, i, arr) => {
                return i != index; 
            });
        }
        function getSelectedConnection() {
            return selectedConnection;
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
            selectedConnection.addComponent(comp);
            compAddConnectionCounter++;
            if (compAddConnectionCounter == 1) {
                selectingSecondConnection = true;
            }
            else if (compAddConnectionCounter == 2) {
                drawConnection = false;
                selectingSecondConnection = false;
                selectedConnection = null;
                compAddConnectionCounter=0;
                updateMouseCursor();
            }
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
                removeConnection:removeConnection,
                getSelectedConnection:getSelectedConnection,
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