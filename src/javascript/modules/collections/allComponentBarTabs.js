const allComponentBarTabs = (function() {
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
        function hideCurrentButtons() {
            print(currentTab.getTitle());
            currentTab.getBar().getUL().hide();
        }
        function unsetVisableCurrent() {
            currentTab.getLI().removeClass('active');
        }

        function setVisableCurrent(tab) {
            tab.getLI().addClass('active');
            setCurrent(tab);
        }

        return {add:add,
                length:length,
                get:get,
                setCurrent:setCurrent,
                getCurrent:getCurrent,
                hideCurrentButtons:hideCurrentButtons,
                unsetVisableCurrent:unsetVisableCurrent,
                setVisableCurrent,setVisableCurrent
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

export default allComponentBarTabs;