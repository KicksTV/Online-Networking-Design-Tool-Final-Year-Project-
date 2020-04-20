var allComponents = (function() {
    var instance;
    
    function init() {
     
        var _components = [];
        
        function get() {
            return _components;
        }
        function set(newlist) {
            _components = newlist;
        }
        function add(comp) {
            _components.push(comp);
        }
        function length() {
            return _components.length;
        }
        function isEmpty() {
            if (_components.length == 0) {
                return true;
            } else {
                return false;
            }
        }
        return {
            get:get,
            set:set,
            add:add,
            length:length,
            isEmpty:isEmpty,
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