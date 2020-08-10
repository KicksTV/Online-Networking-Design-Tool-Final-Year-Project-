// Collections
import allComponents from '../collections/allComponents.js';

const Graph = (function () {
    var instance;
    function init() {

        // Graph
        var _adjacencyList = new Map();
        var foundNodesFromSearch = [];

        function addNode(component) {
            _adjacencyList.set(component, []);
        }
        function addEdge(src, target) {
            _adjacencyList.get(src).push(target);
            _adjacencyList.get(target).push(src);
        }
        function getNodes() {
            return _adjacencyList.entries();
        }
        function updateGraph() {
            for (const [key, value] of _adjacencyList.entries()) {
                let exists = false;
                let foundComp = allComponents.getInstance().getAll().find(comp => comp.id == key);
                if (foundComp) {
                    exists = true;
                }
                if (! exists) {
                    for (let adjComp of value) {
                        let adjCompValues = _adjacencyList.get(adjComp);
                        const index = adjCompValues.indexOf(key);
                        if (index > -1) {
                            adjCompValues.splice(index, 1);
                            _adjacencyList.set(adjComp, adjCompValues);
                        }
                    }
                    _adjacencyList.delete(key);
                }
            }
            console.log("Updated Graph");
        }
        function set(index, obj) {
            _adjacencyList[index] = obj;
        }
        function length() {
            return _adjacencyList.length;
        }
        function toList() {
            return _adjacencyList;
        }
        function depthFirstSearchForHostDevices(start, searchCase, visited = new Set()) {

            // Resetting Search
            if (visited.size == 0) {
                foundNodesFromSearch = [];
            }
            visited.add(start);

            const destinations = _adjacencyList.get(start);



            for (const destination of destinations) {

                // Prevents from travelling up the graph
                if (! destination.includes("Router")) {
                    // Retrieves component object
                    var adjacentComp = allComponents.getInstance().getAll().find(nextComp => nextComp.id.toString() === destination.toString());
                    if (adjacentComp) {
                        if (searchCase(adjacentComp) && ! visited.has(destination)) {
                            foundNodesFromSearch.push(adjacentComp);
                        }
                    }
                    if (! visited.has(destination)) {
                        depthFirstSearchForHostDevices(destination, searchCase, visited);
                    }
                }
            }

            if (foundNodesFromSearch) {
                return foundNodesFromSearch;
            } else {
                return null;
            }
        }
        function toJSON() {
            let json = {};

            for (let node of _adjacencyList.keys()) {
                //print(node);
                json[node] = [];

                var newValue = [];
                _adjacencyList.get(node).forEach(adjNode => {
                    newValue.push(adjNode);
                });

                json[node] = newValue;
            }
            return json;
        }

        return {
            getNodes:getNodes,
            set:set,
            addNode:addNode,
            addEdge:addEdge,
            updateGraph:updateGraph,
            depthFirstSearchForHostDevices:depthFirstSearchForHostDevices,
            length:length,
            toList:toList,
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

export default Graph;