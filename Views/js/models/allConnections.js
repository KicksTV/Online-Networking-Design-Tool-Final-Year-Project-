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
            }
        }
        function drawConnetions(xmouse, ymouse) {
            if (selectingSecondConnection == true) {
                selectedConnection.setMousePos(xmouse, ymouse);
            }
        }

        return {add:add,
                length:length,
                get:get,
                getConnetion:getConnetion,
                getSelectedConnection:getSelectedConnection,
                getSelectingSecondConnection:getSelectingSecondConnection,
                selectConnectionForComp:selectConnectionForComp,
                getDrawConnection: getDrawConnection,
                setDrawConnection: setDrawConnection,
                drawConnetions:drawConnetions,
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