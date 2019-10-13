var allComponentBarTabs = (function() {
    var instance;
    
    function init() {
     
        var _tabs = [];
        var xdraw1, ydraw1, xdraw2, ydraw2;
        var setFirstDrawPosition = false;
        var currentTab = null;

        
        function setFirstDrawConnection() {
            for (var i=0;i<_tabs.length;i++) {
                if (_tabs[i].getBar().drawConnection) {
                    xdraw1 = mouseX;
                    ydraw1 = mouseY;
                    setFirstDrawPosition = true;
                }
            }
        }

        function setSecondDrawConnection() {
            if (setFirstDrawPosition) {
                xdraw2 = mouseX;
                ydraw2 = mouseY;
            }
        }

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
        function drawConnection() {
            line(xdraw1, ydraw1, xdraw2, ydraw2);
        }

        return {add:add,
                setFirstDrawConnection:setFirstDrawConnection,
                setSecondDrawConnection:setSecondDrawConnection,
                drawConnection:drawConnection,
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