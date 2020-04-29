var graphCreator2 = (function () {
    var instance;
    function init() {

        // Graph
        var _adjacencyList = new Map();

        function addNode(component) {
            print(component);
            _adjacencyList.set(component, []);
        }
        function addEdge(src, target) {
            _adjacencyList.get(src).push(target);
            _adjacencyList.get(target).push(src);
    
        }
        function setAllEdgesFor(node, adjNodes) {
            //print(_adjacencyList.get(node));
            //print(_adjacencyList);
            // print(node);
            // print(adjNodes);
            _adjacencyList.set(node, adjNodes);
            //print(_adjacencyList);
        }
        function getNodes() {
            return _adjacencyList;
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
        function toJSON() {
            let json = {};

            for (let node of _adjacencyList.keys()) {
                print(node);
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
            setAllEdgesFor:setAllEdgesFor,
            addEdge:addEdge,
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

graphCreator = (uni = false) => {
    const nodes = []
    const edges = []
    return {
        uni,
        nodes,
        edges,
        addNode(id) {
            nodes.push(nodeCreator(id))  
        },
        searchNode(id) {
            return nodes.find(n => n.id === id)
        },
        addEdge(idOne, idTwo) {
            const a = this.searchNode(idOne)
            const b = this.searchNode(idTwo)
    
            a.addNeighbors(b)
            if (!uni) {
            b.addNeighbors(a)
            }
            edges.push(`${idOne}${idTwo}`)
        },
        display() {
            return nodes.map(({neighbors, id}) => {
                let output = `${id}`
                if (neighbors.length) {
                output += ` => ${neighbors.map(node => node.id).join(' ')}`
                }
                return output
            }).joing('\n')
        },
        depthFirstSearch(startingNode, neighborVisit) {
            const firstNode = this.searchNode(startingNode)
            const visitedNode = nodes.reduce((sum, node) => {
                sum[node.id] = false
                return sum
            }, {})
            // Write the next code here
        },
    }
}