var networkController = (function() {
    var instance;
    
    function init() {
     
        var networkObject = function () {
            this.numberOfHosts = calculateAllHost();
            this.numberOfSubnets = calculateAllSubnets();
            this.subnetmask = calculateSubnetMask();
            this.supernetmask = calculateSupernetMask(this.numberOfSubnets);
        };
        var network = new networkObject();

        var hostBits = 0;

        // dat.GUI
        var networkPropertiesPanel = null;

        function initGUI() {
            networkPropertiesPanel = gui.addFolder("Network Properties");
            networkPropertiesPanel.add(network, 'numberOfHosts').listen();
            networkPropertiesPanel.add(network, 'numberOfSubnets').listen();
            networkPropertiesPanel.add(network, 'subnetmask').listen();
            networkPropertiesPanel.add(network, 'supernetmask').listen();

            networkPropertiesPanel.open();
        }

        function getSubnetMask() {
            return subnetmask;
        }
        function getSupernetMask() {
            return supernetmask;
        }

        // network functions
        function calculateAllNetworkProperties() {
            network.numberOfHosts = calculateAllHost();
            network.numberOfSubnets = calculateAllSubnets();
            network.subnetmask = calculateSubnetMask();
            network.supernetmask = calculateSupernetMask();
            print("network change event");
        }
        function calculateSupernetMask(subnets) {
            // Calculates the Supernet Mask for network,
            // Must have already calculated Subnet Mask to get hostbits.
            
            // var subnets = 16;
            //var x = 2;
            var subnetBits = 1;

            //print("Number of subnets: " + subnets);
            print("hostBits: " +hostBits);

            // calculating the necessary subnet bits needed
            var i=subnetBits+hostBits;
            while (subnets > Math.pow(2, i)) {
                i++;
                subnetBits = i-hostBits;
            }

            print("SubnetBits: " + subnetBits);

            // Total number of bits in an IP address
            var totalBits = 32;

            var slashValue = totalBits - (subnetBits + hostBits);

            // calculates the decimal representation of slash value.
            var decimalNotationOfSupernetmask = calculateDecimalFromSlashValue(slashValue);

            return decimalNotationOfSupernetmask;
        }

        function calculateSubnetMask() {
            hostBits = 0;
            //var hosts = 16;
            var x = 2;
            
            var hosts = getLargestSubnet();

            // Required hosts bits
            hosts += 1;
            //print("Number of hosts: " + hosts);


            // calculating the necessary host bits needed, includes id and broadcast addresses
            var i=0;
            while (hosts > Math.pow(2, i)-2) {
                //print(Math.pow(2, i));
                i++;
                hostBits = i;
            }

            //print("Number of possible IP addresses: " + (Math.pow(2, hostBits)-2));
            //print("host bit required: " + hostBits);
            //print("Total number of host ip addresses + id and broadcast addresses: " + Math.pow(x, hostBits));
            
            // Total number of bits in an IP address
            var totalBits = 32;
            // Calculation for slashValue
            var slashValue = totalBits - hostBits;

            //print("slashValue: " + slashValue);

            // Calculate the subnet mask representation in decimal notation.
            var decimalNotationOfSubnetmask = calculateDecimalFromSlashValue(slashValue);

            return decimalNotationOfSubnetmask;
        }

        function calculateDecimalFromSlashValue(slashValue) {
            // Can be used to calculate the Supernet or Subnet Mask dotted decimal notation.
            var bits=0;
            var decimalNotation = "";
            for (var i=0; i <= slashValue; i++) {
                if (bits == 8) {
                    decimalNotation += "255."
                    bits=0;
                } 
                else if (i==slashValue) {
                    var mask = 0;
                    var addedBits = 0;
                    for (var l=7;l>7-bits;) {
                        mask += Math.pow(2, l);
                        //print(Math.pow(2, l));
                        l--;
                    }
                    //print("addedbits: " + addedBits);
                    mask -= addedBits;
                    decimalNotation += "" + mask + ".";
                }
                bits++;
            }

            // Adding trailing 0's at end of subnet mask if it is less than /24
            var numberOfOctets = decimalNotation.split(".").length -1;
            //print("numberOfOctets: " + numberOfOctets);
            for (var i=0; i < 4 - numberOfOctets; i++) {
                if (i+1 == 4 - numberOfOctets) {
                    decimalNotation += "0";
                } else {
                    decimalNotation += "0.";
                }
            }

            // Remove any additional periods
            if (numberOfOctets > 3) {
                decimalNotation = decimalNotation.slice(0, -1);
            }

            return decimalNotation;
        }

        // Calculates all the host devices currently displayed on canvas
        function calculateAllHost() {
            var totalNumberOfHosts = 0;
            allComps.get().forEach((comp) => {
                if (compContrInstance.isEndDevice(comp)) {
                    totalNumberOfHosts += 1;
                }
            });
            return totalNumberOfHosts;
        }

        // Calculates number of subnets currently on canvas
        function calculateAllSubnets() {
            var totalNumberOfSubnets = 0;
            var connections = [];
            
            allComps.get().forEach((comp) => {
                //print(comp.getComponentName());
                //print(allConnections.getInstance().getConnectionsRelatedToComp(comp));
                if (comp.getType() == "Router") {
                    //print("found router");
                    allConnections.getInstance().getConnectionsRelatedToComp(comp).forEach((con) => {
                        connections.push(con);
                    });
                }
            });
            //print(connections);
            if (connections != null) {
                connections = connections.filter((connections, index, self) =>
                    index === self.findIndex((c) => (
                        c.getComponent(0).getID() === connections.getComponent(0).id &&
                        c.getComponent(1).getID() === connections.getComponent(1).id
                    ))
                );
                totalNumberOfSubnets += connections.length;
            }

            return totalNumberOfSubnets;
        }
        function getLargestSubnet() {
            var largestSubnet = 0;
            //Get all routers
            var allRouters = allComps.get().filter(comp => comp.getType() == "Router");

            for (let router of allRouters) {
                let connections = allConnections.getInstance().getConnectionsRelatedToComp(router);
                for (let nextConnection of connections) {
                    var subnetHostSize = 0;
                    var searchingComp;

                    var currSubnet;
                    var foundSubnet = allSubnets.getInstance().toList().find(subnet => subnet.gatewayRouterID == router.getID() && subnet.connectionID == nextConnection.getID());
                   
                    // Creating or finding subnet object
                    if (foundSubnet == null) {

                        currSubnet = new Subnet();
                        currSubnet.gatewayRouterID = router.getID();
                        currSubnet.connectionID = nextConnection.getID();
                        allSubnets.getInstance().add(currSubnet);

                    }
                    else {
                        currSubnet = foundSubnet;
                        currSubnet.gatewayRouterID = router.getID();
                        currSubnet.connectionID = nextConnection.getID();
                    }

                    // Getting adjacent component to router
                    if (nextConnection.getComponent(0).type != 'Router') {
                        searchingComp = nextConnection.getComponent(0);
                    }
                    else if (nextConnection.getComponent(1).type != 'Router') {
                        searchingComp = nextConnection.getComponent(1);
                    }

                    // if component exists, continue to find end devices.
                    if (searchingComp) {
                        let result = Graph.getInstance().depthFirstSearchForHostDevices(searchingComp.id, componentController.getInstance().isEndDevice);
                        if (result != null) {
                            subnetHostSize = result.length;
                        }
                        if (subnetHostSize > largestSubnet) {
                            largestSubnet = subnetHostSize;
                        } 
                        currSubnet.setEndDevices(result);
                    }
                }

            }  
            print("largest Subnet: " + largestSubnet);
            return largestSubnet;       
        }
        function binaryToDecimal(IPaddress) {
            var decimalRepresentation = "";
            IPaddress.split(".").forEach(octet => {
                decimalRepresentation += parseInt(octet, 2)+".";
            });
            decimalRepresentation = decimalRepresentation.slice(0, -1);
            return decimalRepresentation;
        }
        function decimalToBinary(IPaddress) {
            // converting to binary representation
            var binary = "";
            IPaddress.split(".").forEach(octet => {
                var conversionToBinary = (parseInt(octet) >>> 0).toString(2);
                while (conversionToBinary.length < 8) {
                    conversionToBinary = "0" + conversionToBinary;
                }
                binary += conversionToBinary + ".";
            });
            // Remove trailing "."
            binary = binary.slice(0, -1);
            return binary;
        }

        function calculateSubnetID(IPaddress, SubnetMask) {
            var IPBinary = decimalToBinary(IPaddress);
            var SubnetMaskBinary = decimalToBinary(SubnetMask);
            // print(IPBinary);
            // print(SubnetMaskBinary);
            // print("---------------------------");
            var ANDresult = "";
            for (var i=0; i<4; i++) {
                var IPoctect = IPBinary.split(".")[i];
                var SubnetMaskoctect = SubnetMaskBinary.split(".")[i];

                for (var l=0;l<8;l++) {
                    ANDresult += (parseInt(IPoctect.charAt(l), 2) & parseInt(SubnetMaskoctect.charAt(l), 2)).toString();
                }
            }
            //print(ANDresult);
            var subnetIDBinary = "";
            for (var i=0; i<ANDresult.length;i+=8) {
                var octet = ANDresult.substring(i,i+8);
                subnetIDBinary += octet+".";
            }
            subnetIDBinary = subnetIDBinary.slice(0, -1);
            //print(subnetIDBinary);
            var subnetIDDecimal = binaryToDecimal(subnetIDBinary);
            return subnetIDDecimal;
        }

        function checkIPAddressInput(event, connection) {
            var interfaceValues;
            var currentSelectedComp = componentController.getInstance().getSelectedComponent();

            if (connection.getComponent(0) == currentSelectedComp) {
                interfaceValues = connection.getInterfacePort(0);
            }
            else if (connection.getComponent(1) == currentSelectedComp) {
                interfaceValues = connection.getInterfacePort(1);
            }

            var inter = interfaceValues[0];
            var port = interfaceValues[1];

            var routerComp = null;
            if (currentSelectedComp.getType() == "Router") {
                routerComp = currentSelectedComp;
            }

            // Preventing characters otherthan numbers from being entered
            var regex = new RegExp("^[a-zA-Z]+$");
            if (regex.test(event.key)) {
                if (event.key.toString().length == 1) {
                    event.preventDefault();
                }
            }
            if (event.key == "Enter") {
                event.preventDefault();
            }
            print("Address entered");

            // Get all field content and last key pressed
            var IPaddressField = event.srcElement.innerText + event.key;

            // Get the number of octets currently IP address field
            var numberOfOctets = IPaddressField.split(".").length;

            // Array of octets
            var octets = IPaddressField.split(".");

            var ipfield = event.target;

            
            if (routerComp != null) {

                // Checks if whole address has been entered
                if (numberOfOctets == 4 && octets[3] != "") {
                    
                    // Calculate subnet ID & gateway IP
                    inter.portIPaddress[port] = IPaddressField;
                    
                    const found = allSubnets.getInstance().toList().find(x => x.gatewayRouterID == routerComp.getID());
                    found.gatewayRouterIP = IPaddressField;

                    // Setting Subnet ID
                    let subnetmask = networkController.getInstance().getSubnetMask();
                    found.subnetID = networkController.getInstance().calculateSubnetID(found.gatewayRouterIP, subnetmask);

                }
            } else {

                // Finding subnet related to selected component
                var foundSubnetforComp = null;
                allSubnets.getInstance().toList().forEach(s => {
                    var found = s.endDevices.find(x => x == currentSelectedComp);
                    if (found != null) {
                        foundSubnetforComp = s;
                    }
                });


                if (foundSubnetforComp) {

                    // Checks if router has been assigned an IP address first
                    if (foundSubnetforComp.gatewayRouterIP == null) {
                        e.preventDefault();
                        alert("Please assign an IP address to Default Gateway (Router) first.");
                    } else {
                        
                        if (numberOfOctets == 4 && octets[3] != "") {
                            // Checking for valid assignment of IP address.

                            let subnetmask = networkController.getInstance().getSubnetMask();

                            var subnetID = networkController.getInstance().calculateSubnetID(IPaddressField, subnetmask);

                            if (subnetID == foundSubnetforComp.subnetID) {
                                // Valid IP address for subnet

                                ipfield.className = "qs_valid_ip_address";

                                inter.portIPaddress[port] = IPaddressField;

                            } else {
                                // Not valid IP address for subnet

                                ipfield.className = "qs_invalid_ip_address";
                            }
                        }
                    }
                } else {
                    alert("Device is not part of any subnet!");
                }
            }
        }
        function toJSON() {
            var json = [];
            var endDevicesID = [];
            // Saving all subnets
            allSubnets.getInstance().getAll().forEach(s => {
                for (var endDevice of s.endDevices) {
                    endDevicesID.push(endDevice.id);
                }

                s.endDevices = endDevicesID;
                json.push(s);
            });
            return json;
        }
        
        return {
            initGUI:initGUI,
            calculateAllNetworkProperties:calculateAllNetworkProperties,
            calculateAllHost:calculateAllHost,
            calculateAllSubnets:calculateAllSubnets,
            calculateSupernetMask:calculateSupernetMask,
            calculateSubnetMask:calculateSubnetMask,
            calculateDecimalFromSlashValue:calculateDecimalFromSlashValue,
            binaryToDecimal:binaryToDecimal,
            decimalToBinary:decimalToBinary,
            calculateSubnetID:calculateSubnetID,
            getSubnetMask:getSubnetMask,
            getSupernetMask:getSupernetMask,
            checkIPAddressInput:checkIPAddressInput,
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