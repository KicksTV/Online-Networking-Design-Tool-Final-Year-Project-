var allPanels = (function () {
    var instance;
    function init() {
        var _panels = [];

        function add(p) {
            _panels.push(p);
        }
        function get(index) {
            return _panels[index];
        }
        function getAll() {
            return _panels;
        }
        function set(index, obj) {
            _panels[index] = obj;
        }
        function length() {
            return _panels.length;
        }
        function toList() {
            return _panels;
        }

        return {
            get:get,
            getAll:getAll,
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