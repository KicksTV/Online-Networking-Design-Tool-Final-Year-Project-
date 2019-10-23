var allComponentBarTabs = (function() {
    var instance;
    
    function init() {
     
        var _tabs = [];
        var currentTab = null;
        

        function add(tab) {
            // Setting first item to be added into list as current tab
            if (_tabs.length == 0) {
                currentTab = tab;
            }
            _tabs.push(tab);
        }
        function length() {
            return _tabs.length;
        }
        function get(num) {
            return _tabs[num];
        }
        function setCurrent(tab) {
            currentTab = tab;
        }
        function getCurrent() {
            return currentTab;
        }
        function getDrawConnection() {
            return drawConnection;
        }
        function setDrawConnection(val) {
            drawConnection = val;
        }

        return {add:add,
                length:length,
                get:get,
                setCurrent:setCurrent,
                getCurrent:getCurrent,
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