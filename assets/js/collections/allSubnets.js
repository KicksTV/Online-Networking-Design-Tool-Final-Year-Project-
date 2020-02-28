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
        function set(index, obj) {
            _subnets[index] = obj;
        }
        function length() {
            return _subnets.length;
        }
        function toList() {
            return _subnets;
        }

        return {
            get:get,
            set:set,
            add:add,
            length:length,
            toList:toList,
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