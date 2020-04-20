var networkController = (function() {
    var instance;
    
    function init() {
     
        var subnetmask;
        var supernetmask;

        var largestSubnet = 0;
        var numberOfEndDevices = 0;
        var previousComp = null;
        var currentRouter = null;

        var numberOfConnections = 0;
        var traveledConnections = [];
        var previousConnection = null;
        
        var hostBits = 0;
        var currSubnet;

        function getSubnetMask() {
            return subnetmask;
        }
        function getSupernetMask() {
            return supernetmask;
        }

        // network functions
        
        function calculateSupernetMask(subnets) {
            // Calculates the Supernet Mask for network,
            // Must have already calculated Subnet Mask to get hostbits.
            
            //var subnets = 16;
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

            supernetmask = decimalNotationOfSupernetmask;

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

            subnetmask = decimalNotationOfSubnetmask;

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
                        c.getComponent(0).getID() === connections.getComponent(0).getID() &&
                        c.getComponent(1).getID() === connections.getComponent(1).getID()
                    ))
                );
                totalNumberOfSubnets += connections.length;
            }
            return totalNumberOfSubnets;
        }

        function getLargestSubnet() {
            var allRouters = [];

            // keeps record of which connections have been traveled
            traveledConnections = [];

            // stores the largest subnet
            largestSubnet = 0;

            // getting all routers
            allComps.get().forEach((comp) => {
                if (comp.getType() == "Router") {
                    allRouters.push(comp);
                }
            });

            allRouters.forEach((r) => {
                // get all connections related to a router
                var routerConnections = allConnections.getInstance().getConnectionsRelatedToComp(r);

                currentRouter = r;
                previousComp = r;
                routerConnections.forEach((c) => {

                    // reset counter for hosts per subnet
                    numberOfEndDevices = 0;
                    
                    // comp should not equal a router
                    var comp = null;
                    if (c.getComponent(0).getType() != "Router") {
                        comp = c.getComponent(0);
                    }
                    else if (c.getComponent(1).getType() != "Router") {
                        comp = c.getComponent(1);
                    }
                    
                    if (comp != null) {
                        // Check if subnet already exists
                        var foundSubnet = allSubnets.getInstance().toList().find(x => x.gatewayRouterID == r.getID() && x.connection == c.getID());
                        if (foundSubnet == null) {
                            currSubnet = new Subnet();
                            currSubnet.gatewayRouterID = r.getID();
                            currSubnet.connection = c.getID();
                            allSubnets.getInstance().add(currSubnet);
                            //print("---new subnet created---");
                            //print("new subnet ", currSubnet);
                        }
                        else {
                            //print("---found previous subnet created---");

                            currSubnet = foundSubnet;
                            currSubnet.gatewayRouterID = r.getID();
                            currSubnet.connection = c.getID();
                        }

                        // start traveling subnet, passes in comp connected to router e.g. switch
                        travelSubnetTree(comp, comp);
                    }
                });
            });

            //print("largest Subnet: " +largestSubnet);

            return largestSubnet;
        }
        function travelSubnetTree(currentComp, rootComp) {
            
            // check if all connections have been iterated through
            var connections = allConnections.getInstance().getConnectionsRelatedToComp(currentComp);
            numberOfConnections = connections.length;
            var currentConnection = null;

            //print("current comp: "+currentComp.getComponentName());
            //traveledConnections.forEach((c) => {
                //print("Traveled connections: "+c.getComponent(0).getComponentName() + " - " + c.getComponent(1).getComponentName());
            //});
            //print("numberOfEndDevices: "+numberOfEndDevices)

            connections.forEach((c) => {
                //print("----");
                //print("checking connection: "+c.getComponent(0).getComponentName() + " - " +c.getComponent(1).getComponentName());
                //print(hasBeenTraveled(c), isPreviousRoute(c));
                if (! hasBeenTraveled(c) && !isPreviousRoute(c)) {
                    //print("valid")
                    currentConnection = c;
                }
            });

            //print("ids: ", previousComp.getID(), currentRouter.getID());
            //print(previousConnection.getComponent(0).getComponentName(),previousConnection.getComponent(1).getComponentName());
            //print(currentConnection, hasBeenTraveled(previousConnection));
            if (currentConnection == null && hasBeenTraveled(previousConnection)) {
                //print("finished");
                if (largestSubnet < numberOfEndDevices) {
                    largestSubnet = numberOfEndDevices;
                }
                return;
            } else {
                // Checking for next connection
                findAllEndDevices(currentComp, rootComp);
            }
            
        }
        function findAllEndDevices(currentComp, rootComp) {
            var connections = allConnections.getInstance().getConnectionsRelatedToComp(currentComp);
            var numberOfConnections = connections.length;

            var currentConnection = null;
            //print("--- finding all end devies ---");
            connections.forEach((c) => {
                //print("----");
                //print("checking connection: "+c.getComponent(0).getComponentName() + " - " +c.getComponent(1).getComponentName());
                if (! hasBeenTraveled(c) && !isPreviousRoute(c)) {
                    //print("valid");
                    currentConnection = c;
                }
            });
            // checks if there are any end devices.
            var nextComp = null;
            if (currentConnection == null && previousConnection != null) {
                //print("all end devices found");
                traveledConnections.push(previousConnection);
                previousComp = currentRouter;
                travelSubnetTree(rootComp, rootComp);
            } else {
                if (currentConnection.getComponent(0).getID() != currentComp.getID()) {
                    nextComp = currentConnection.getComponent(0);
                } else {
                    nextComp = currentConnection.getComponent(1);
                }
            }

            //print("nextComp: "+nextComp.getComponentName());
            if (nextComp) {
                if (compContrInstance.isEndDevice(nextComp)) {
                    numberOfEndDevices++;
                    traveledConnections.push(currentConnection);
                    previousComp = currentRouter;

                    // ADDING END DEVICE TO SUBNET

                    // CHECK IF DEVICE ALREADY EXISTS IN SUBNET
                    allSubnets.getInstance().toList().forEach(s => {
                        if (! s.endDevices.find(d => d == nextComp.getID())) {
                            if (currSubnet != null) {
                                //print(currSubnet);
                                //print(nextComp.getID());
                                currSubnet.add(nextComp.getID());
                            }
                        }
                    });
                    

                    travelSubnetTree(rootComp, rootComp);
                
                } else {
                    previousComp = currentComp;
                    travelSubnetTree(nextComp, rootComp);
                }
            }
        }   
        function hasBeenTraveled(connection) {
            var hasBeenTraveled = false;
            if (traveledConnections.length != 0) {
                traveledConnections.forEach((c) => {
                    if (c === connection) {
                        hasBeenTraveled = true;
                    }
                });
            }
            return hasBeenTraveled;
        }
        function isPreviousRoute(connection) {
            var isPreviousRoute = false;
            //print("previous route check: "+connection.getComponent(0).getID(), connection.getComponent(1).getID(), previousComp.getID());
            if (connection.getComponent(0).getID() === previousComp.getID() || connection.getComponent(1).getID() === previousComp.getID()) {
                previousConnection = connection;
                isPreviousRoute = true;
            }
            return isPreviousRoute;
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
        
        return {
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