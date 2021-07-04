var allSubnets = (function () {
    var instance;
    function init() {
        var _subnets = [];

        function add(s) {
            _subnets.push(s);
        }
        function get(index) {
            return _subnets[index];
        }
        function getWithConnectionID(connectionID) {
            return _subnets.find(sub => sub.connectionID == connectionID);
        }
        function getAll() {
            return _subnets;
        }
        function set(index, obj) {
            _subnets[index] = obj;
        }
        function length() {
            return _subnets.length;
        }
        function toList() {
            return _subnets;
        }
        function clear() {
            _subnets = [];
        }
        function toJSON() {
            var json = [];
            _subnets.forEach(s => {
                var endDevicesID = [];
                let item = {
                    "subnetID": s.subnetID,
                    "gatewayRouterID": s.gatewayRouterID,
                    "gatewayRouterIP": s.gatewayRouterIP,
                    "endDevices": null,
                    "unavailableAddresses": s.unavailableAddresses,
                    "connectionID": s.connectionID,
                }
                for (var endDevice of s.endDevices) {
                    // console.log(endDevice.id);
                    endDevicesID.push(endDevice.id);
                }
                item.endDevices = endDevicesID;
                json.push(item);
            });
            return json;
        }

        return {
            get:get,
            getWithConnectionID:getWithConnectionID,
            getAll:getAll,
            set:set,
            add:add,
            length:length,
            toList:toList,
            clear:clear,
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

export default allSubnets;