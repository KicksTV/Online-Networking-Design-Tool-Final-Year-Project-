var allConnections = (function() {
    var instance;
    
    function init() {
     
        var _connections = [];
        var selectedConnection;
        
        function add(connection) {
            _connections.push(connection);            
        }

        function length() {
            return _connections.length;
        }
        function get() {
            return _connections;
        }
        function getAll() {
            return _connections;
        }
        function clear() {
            _connections = [];
        }
        function getConnetion(num) {
            return _connections[num];
        }
        function removeConnection(con) {
            var index = _connections.findIndex(c => c === con);
            _connections = _connections.filter((value, i) => {
                return i != index; 
            });
        }
        function getSelectedConnection() {
            return selectedConnection;
        }
        function setSelectedConnection(con) {
            selectedConnection = con;
        }
        function getConnectionsRelatedToComp(c) {
            var _relatedConnections = [];
            _connections.forEach((i) => {
                if (i != selectedConnection) {
                    if (c == i.getComponent(0) || c == i.getComponent(1)) {
                        _relatedConnections.push(i);
                    }
                }
            });
            return _relatedConnections;
        }
        return {add:add,
                length:length,
                get:get,
                getAll:getAll,
                clear:clear,
                getConnetion:getConnetion,
                removeConnection:removeConnection,
                getSelectedConnection:getSelectedConnection,
                setSelectedConnection:setSelectedConnection,
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

export default allConnections.getInstance();