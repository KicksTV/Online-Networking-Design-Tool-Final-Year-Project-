const allValidationRules = (function() {
    var instance;
    
    function init() {
     
        var _rules = [];
        var lastBrokenRule = null;

        function add(rules) {
            _rules.push(rules);
        }
        function length() {
            return _rules.length;
        }
        function get(index) {
            return _rules[index];
        }
        function isValidConnection(type1, type2) {
            var validConnection = true;
            
            _rules.forEach((r) => {
                if (r.getRuleType(0) == type1 && r.getRuleType(1) == type2 || r.getRuleType(0) == type2 && r.getRuleType(1) == type1) {
                    lastBrokenRule = r;
                    console.log("lastBrokenRule");
                    validConnection = false;
                }
            });
            
            return validConnection;
        }
        function getLastBrokenRule() {
            return lastBrokenRule;
        }

        return {
            add:add,
            length:length,
            get:get,
            isValidConnection:isValidConnection,
            getLastBrokenRule:getLastBrokenRule,
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

export default allValidationRules;
