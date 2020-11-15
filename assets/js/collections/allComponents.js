var allComponents = (function() {
    var instance;
    
    function init() {
     
        var _components = [];
        
        function getAll() {
            return _components;
        }
        // Will eventually get component by index
        function get() {
            return _components;
        }
        function getWithID(id) {
            return _components.find(comp => comp.id == id);
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
        function clear() {
            _components = [];
        }
        return {
            get:get,
            getAll:getAll,
            getWithID:getWithID,
            set:set,
            add:add,
            length:length,
            isEmpty:isEmpty,
            clear:clear,
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

export default allComponents.getInstance();