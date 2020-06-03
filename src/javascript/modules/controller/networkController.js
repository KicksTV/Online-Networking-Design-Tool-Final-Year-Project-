// Controllers
import componentController from '../controller/componentController.js';

// Collections
import allComps from '../collections/allComponents.js';
import allConnections from '../collections/allConnections.js';
import allSubnets from '../collections/allSubnets.js';

// Models
import Graph from '../models/graph.js';
import Subnet from '../models/Subnet.js';

const networkController = (function() {
    var instance;
    
    function init() {
     
        var networkObject = function () {
            this.hosts = 0;
            this.subnets = 0;

            // User inputted network properties
            this.subnetMask = "255.255.255.252";
            this.supernetMask = "255.255.255.248";


            this.availableHostAddresses;
            this.availableSubnets;
            this.totalIPAddresses = calculateTotalIPAddresses(this.subnetMask);
            this.totalSubnets = calculateTotalNumberSubnets(this.supernetMask);

            this.calculatedSubnetmask = calculateSubnetMask();
            this.calculatedSupernetmask = calculateSupernetMask(this.subnets);

            this.autoCalculateMasks = true;

            this.calculateNetworkMasks = () => {
                let subnetmask = calculateSubnetMask();
                let supernetmask = calculateSupernetMask(this.subnets);
                this.calculatedSubnetmask = subnetmask;
                this.calculatedSupernetmask = supernetmask;

                if (this.autoCalculateMasks) {
                    this.subnetMask = subnetmask;
                    this.supernetMask = supernetmask;

                    this.totalIPAddresses = calculateTotalIPAddresses(subnetmask);
                    this.totalSubnets = calculateTotalNumberSubnets(supernetmask);
                } else {
                    this.totalIPAddresses = calculateTotalIPAddresses(this.subnetMask);
                    this.totalSubnets = calculateTotalNumberSubnets(this.supernetMask);
                }
            }
        };
        var networkChangeEvent = new CustomEvent('networkChangeEvent');

        var network = new networkObject();

        var hostBits = 0;

        // dat.GUI
        var gui = null;
        var networkPropertiesPanel = null;
        var properties = [];

        function initGUI(g) {
            gui = g;
            networkPropertiesPanel = g.addFolder("Network Properties");
            createNetworkPropertiesPanel();
            networkPropertiesPanel.open();

            initGuiControllerEvents();
        }
        function createNetworkPropertiesPanel() {
            var hosts = networkPropertiesPanel.add(network, 'hosts').listen();
            var subnets = networkPropertiesPanel.add(network, 'subnets').listen();
            var totalHosts = networkPropertiesPanel.add(network, 'totalIPAddresses').listen();
            var totalSubnets = networkPropertiesPanel.add(network, 'totalSubnets').listen();

            var subnetController;
            var supernetController;

            if (! network.autoCalculateMasks) {
                subnetController = networkPropertiesPanel.add(network, 'subnetMask').listen();
                supernetController = networkPropertiesPanel.add(network, 'supernetMask').listen();
            } else {
                subnetController = networkPropertiesPanel.add(network, 'calculatedSubnetmask').listen();
                supernetController = networkPropertiesPanel.add(network, 'calculatedSupernetmask').listen();
            }
            var autoCalculateController = networkPropertiesPanel.add(network, 'autoCalculateMasks');


            properties = [hosts, subnets, totalHosts, totalSubnets, subnetController, 
                          supernetController, autoCalculateController];
        }
        function removeAllPanelProperties() {
            // print(networkPropertiesPanel);

            networkPropertiesPanel.remove(properties[0]);     
            networkPropertiesPanel.remove(properties[1]);              
            networkPropertiesPanel.remove(properties[2]);              
            networkPropertiesPanel.remove(properties[3]); 
            networkPropertiesPanel.remove(properties[4]);              
            networkPropertiesPanel.remove(properties[5]);              
            networkPropertiesPanel.remove(properties[6]); 
        }
        function initGuiControllerEvents() {
            
            var subnetController = properties[4];
            subnetController.onChange(function(value) {
                // Fires on every change, drag, keypress, etc.
                if (! isValidSubnetMask(value)) {
                    this.domElement.firstElementChild.style.color = "red";
                } else {
                    this.domElement.firstElementChild.style.color = "#1ed36f";
                }
                
            });
            subnetController.onFinishChange(function(value) {
                // Fires when a controller loses focus.
                // alert("The new value is " + value);

                var oldValue = this.initialValue;

                network.subnetMask = value;

                if (isValidSubnetMask(value)) {
                    this.domElement.firstElementChild.style.color = "#1ed36f";
                } else {
                    network.subnetMask = oldValue;
                    this.domElement.firstElementChild.style.color = "orange";
                }

                window.setTimeout(() => {
                    this.domElement.firstElementChild.style.color = "1ed36f";
                }, 2000);
            });



            var supernetController = properties[5];
            supernetController.onChange(function(value) {
                // Fires on every change, drag, keypress, etc.

                if (! isValidSupernetMask(value)) {
                    this.domElement.firstElementChild.style.color = "red";
                } else {
                    this.domElement.firstElementChild.style.color = "#1ed36f";
                }
            });
              
            supernetController.onFinishChange(function(value) {
                // Fires when a controller loses focus.

                var oldValue = this.initialValue;

                network.supernetMask = value;

                if (isValidSupernetMask(value)) {
                    this.domElement.firstElementChild.style.color = "#1ed36f";
                } else {
                    network.supernetMask = oldValue;
                    this.domElement.firstElementChild.style.color = "orange";
                }

                window.setTimeout(() => {
                    this.domElement.firstElementChild.style.color = "1ed36f";
                }, 2000);

            });


            var autoCalculateController = properties[6];
            autoCalculateController.onChange(function(value) {
                // Fires on every change, drag, keypress, etc.

                network.autoCalculateMasks = value;

                calculateAllNetworkProperties();

                if (value) {
                    // Automatically apply calculated network parameters and listen to network changes
                    // print("auto true");
                    removeAllPanelProperties();

                } else {
                    // Only listen to user input network parameters
                    // print("auto false");
                    removeAllPanelProperties();
                }
                createNetworkPropertiesPanel();
                initGuiControllerEvents();
            });
        }

        function getSubnetMask() {
            return network.calculatedSubnetmask;
        }
        function getSupernetMask() {
            return network.calculatedSupernetmask;
        }

        function initNetworkListener() {
            gui.domElement.addEventListener('networkChangeEvent', calculateAllNetworkProperties);
        }

        function dispatchNetworkChangeEvent() {
            componentController.getInstance().getGUI().domElement.dispatchEvent(networkChangeEvent);
        }

        

        // network functions
        function calculateAllNetworkProperties() {
            network.hosts = calculateAllHost();
            network.subnets = calculateAllSubnets();

            network.calculateNetworkMasks();

            // print(network);
            print("network change event");
        }
        function calculateSupernetMask(subnets) {
            // Calculates the Supernet Mask for network,
            // Must have already calculated Subnet Mask to get hostbits.
            
            // var subnets = 16;
            //var x = 2;
            var supernetBits = 1;

            // print("-----------------");

            // print("subnets", subnets);

            //print("Number of subnets: " + subnets);
            // print("hostBits: " +hostBits);

            // calculating the necessary subnet bits needed
            // Need to -1 to start from 0
            var i=(supernetBits+hostBits)-1;

            while (subnets > Math.pow(2, i)) {
                i++;
                // Adding back the 1 that was taken away earlier
                supernetBits = (i-hostBits) + 1;
            }

            // print("supernetBits",supernetBits);

            // Total number of bits in an IP address
            var totalBits = 32;

            var slashValue = totalBits - (supernetBits + hostBits);

            // print("slashValue", slashValue);

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
            allComps.getInstance().get().forEach((comp) => {
                if (componentController.getInstance().isEndDevice(comp)) {
                    totalNumberOfHosts += 1;
                }
            });
            return totalNumberOfHosts;
        }

        function calculateTotalIPAddresses(subnetmask) {
            var octets = subnetmask.split(".");
            var totalNumberOfHosts = 1;

            octets.forEach(octet => {
                if (octet != "255") {
                    var conversionToBinary = (parseInt(octet) >>> 0).toString(2);
                    // print("binary", conversionToBinary);
                    let length = conversionToBinary.length;
                    let index = 1;
                    for (let char of conversionToBinary) {
                        if (char == '0') {
                            let bitPosition = length-index;
                            // print(bitPosition);
                            totalNumberOfHosts += Math.pow(2, bitPosition)
                        }
                        index++;
                    }   
                }
            });
            // Calculating totalNumberOfHosts with the addition of subnetID and broadcastID
            totalNumberOfHosts = totalNumberOfHosts - 2;

            // print("totalNumberOfHosts", totalNumberOfHosts);
            return totalNumberOfHosts;
        }

        // Calculates number of subnets currently on canvas
        function calculateAllSubnets() {
            var totalNumberOfSubnets = 0;
            var connections = [];
        
            for (let comp of allComps.getInstance().getAll()) {
                //print(comp.getComponentName());
                //print(allConnections.getInstance().getConnectionsRelatedToComp(comp));
                if (comp.name == "Router") {
                    //print("found router");
                    allConnections.getInstance().getConnectionsRelatedToComp(comp).forEach((con) => {
                        connections.push(con);
                    });
                }
            }
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

            // print("totalNumberOfSubnets", totalNumberOfSubnets);

            return totalNumberOfSubnets;
        }


        function calculateTotalNumberSubnets(supernetmask) {
            var octets = supernetmask.split(".");
            var totalNumberOfSubnets = 0;

            octets.forEach(octet => {
                if (octet != "255") {
                    var conversionToBinary = (parseInt(octet) >>> 0).toString(2);
                    // print("binary", conversionToBinary);
                    let length = conversionToBinary.length;
                    let index = 1;
                    // print("hostBits", hostBits);
                    // print(conversionToBinary);
                    for (let char of conversionToBinary) {
                        let bitPosition = length-index;
                        // print(bitPosition);
                        if (char == '0' && bitPosition > 1) {
                            // print(bitPosition);
                            totalNumberOfSubnets += Math.pow(2, bitPosition)
                        }
                        index++;
                    }   
                }
            });
            // print("totalNumberOfSubnets", totalNumberOfSubnets);
            return totalNumberOfSubnets;
        }


        function getLargestSubnet() {
            var largestSubnet = 0;
            //Get all routers
            var allRouters = allComps.getInstance().get().filter(comp => comp.name == "Router");

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
                        currSubnet.createSubnet(result);
                    }
                }

            }  
            // print("largest Subnet: " + largestSubnet);
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

        function getBroadcastID(subnetID, subnetmask) {
            var subnetIDBinary = decimalToBinary(subnetID);
            var SubnetMaskBinary = decimalToBinary(subnetmask);

            // Looping through octets and each binary character
            var result = "";
            for (var i=0; i<4; i++) {
                var SubnetIDoctect = subnetIDBinary.split(".")[i];
                var SubnetMaskoctect = SubnetMaskBinary.split(".")[i];

                for (var l=0;l<8;l++) {
                    if (parseInt(SubnetMaskoctect.charAt(l), 2) == 0) {
                        result += 1;
                    } else {
                        result += (parseInt(SubnetIDoctect.charAt(l), 2) & parseInt(SubnetMaskoctect.charAt(l), 2)).toString();
                    }
                }
            }

            // splits result back into 4 octets
            var broadcastIDBinary = "";
            for (var i=0; i<result.length;i+=8) {
                var octet = result.substring(i,i+8);
                broadcastIDBinary += octet+".";
            }

            // Removes trailing "."
            broadcastIDBinary = broadcastIDBinary.slice(0, -1);

            var broadcastIDDecimal = binaryToDecimal(broadcastIDBinary);

            return broadcastIDDecimal;

        }
        function isValidInput(value) {
            var isValid = false;
            var regex = RegExp("(?:[0-9]{1,3}\.){3}[0-9]{1,3}");
            if (regex.exec(value)) {
                isValid = true;
            } else {
                $('#warningConnectionToastAlert').toast('show');
                $('#warningConnectionToastAlert .toast-body').text(
                    "Error: Invalid input! Example SubnetMask: 255.255.255.240"
                );
            }
            return isValid;
        }

        function isValidSubnetMask(value) {
            var isValid = false;
            if (isValidInput(value)) {
                if (network.calculatedSubnetmask) {

                    var calOctets = network.calculatedSubnetmask.split(".");
                    var enteredOctets = value.split(".");

                    var validFirstOctet = false;
                    var validSecondOctet = false;
                    var validThirdOctet = false;
                    var validForthOctet = false;


                    if (enteredOctets.length == 4) {
                        if (calOctets[0] >= enteredOctets[0]) {
                            validFirstOctet = true;
                        }
                        if (calOctets[1] >= enteredOctets[1]) {
                            validSecondOctet = true;
                        }
                        if (calOctets[2] >= enteredOctets[2]) {
                            validThirdOctet = true;
                        }
                        if (calOctets[3] >= enteredOctets[3]) {
                            validForthOctet = true;
                        }

                        if (validFirstOctet && validSecondOctet && validThirdOctet && validForthOctet) {
                            isValid = true;
                        } else {
                            $('#warningConnectionToastAlert').toast('show');
                            $('#warningConnectionToastAlert .toast-body').text(
                                "Error: Require more host bits!"
                            );
                        }
                    }

                }
            }
            // print(isValid);
            return isValid;
        }

        function isValidSupernetMask(value) {
            var isValid = false;
            if (isValidInput(value)) {
                if (network.calculatedSupernetmask) {

                    var calOctets = network.calculatedSupernetmask.split(".");
                    var enteredOctets = value.split(".");

                    var validFirstOctet = false;
                    var validSecondOctet = false;
                    var validThirdOctet = false;
                    var validForthOctet = false;


                    if (enteredOctets.length == 4) {
                        if (calOctets[0] >= enteredOctets[0]) {
                            validFirstOctet = true;
                        }
                        if (calOctets[1] >= enteredOctets[1]) {
                            validSecondOctet = true;
                        }
                        if (calOctets[2] >= enteredOctets[2]) {
                            validThirdOctet = true;
                        }
                        if (calOctets[3] >= enteredOctets[3]) {
                            validForthOctet = true;
                        }

                        if (validFirstOctet && validSecondOctet && validThirdOctet && validForthOctet) {
                            isValid = true;
                        } else {
                            $('#warningConnectionToastAlert').toast('show');
                            $('#warningConnectionToastAlert .toast-body').text(
                                "Error: Require more subnet bits!"
                            );
                        }
                    }
                }
            }
            // print(isValid);
            return isValid;
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
            if (currentSelectedComp.name == "Router") {
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
            // print("Address entered");

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
                    let subnetmask = getSubnetMask();
                    found.subnetID = networkController.getInstance().calculateSubnetID(found.gatewayRouterIP, subnetmask);

                }
            } else {

                // Finding subnet related to selected component
                var foundSubnetforComp = null;
                allSubnets.getInstance().toList().forEach(s => {
                    var found = s.endDevices.find(x => x.id == currentSelectedComp.id);
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

                            let subnetmask = getSubnetMask();

                            var subnetID = networkController.getInstance().calculateSubnetID(IPaddressField, subnetmask);
                            
                            // Check against existing assign IP addresses
                            if (subnetID == foundSubnetforComp.subnetID && checkAvailableIPAddress(foundSubnetforComp, IPaddressField)) {
                                // Valid IP address for subnet
                                ipfield.className = "qs_valid_ip_address";
                                inter.portIPaddress[port] = IPaddressField;

                                foundSubnetforComp.addAddressToSubnet(currentSelectedComp, IPaddressField);

                            } else {
                                // Not valid IP address for subnet

                                ipfield.className = "qs_invalid_ip_address";

                                $('#warningConnectionToastAlert').toast('show');
                                $('#warningConnectionToastAlert .toast-body').text(
                                    "Invalid IP address for subnet!"
                                );
                            }
                        }
                    }
                } else {
                    alert("Device is not part of any subnet!");
                }
            }
        }
        function checkAvailableIPAddress(subnet, ip) {
            var validIP = true;
            let subnetmask = getSubnetMask();
            let broadcastID = getBroadcastID(subnet.subnetID, subnetmask);
            var currentUnavailableAddress = [subnet.gatewayRouterIP, subnet.subnetID, broadcastID];

            let takenHostAddresses = subnet.unavailableAddresses;

            takenHostAddresses.forEach(address => {
                currentUnavailableAddress.push(address);
            });


            var currentSelectedComp = componentController.getInstance().getSelectedComponent();

            currentUnavailableAddress.forEach(takenAddress => {
                //print(ip, takenAddress);


                // Gets the ip address being checked
                var foundUnavailableAddress = subnet.unavailableAddresses.find(x => x === takenAddress);
                var index = subnet.unavailableAddresses.indexOf(foundUnavailableAddress);
                var endDevice = subnet.getEndDevice(index);

                // Checking if the ip address is taken and is not the previous ip address entered for same component
                // If the ip is in the taken list then the ip is not valid
                // If the ip address is in the taken list but is the ip assigned to the component being edited, then
                // it is a valid ip address
                if (ip == takenAddress && endDevice != currentSelectedComp) {
                    //print(endDevice, currentSelectedComp);
                    // Not valid
                    validIP = false;
                }
            });
            return validIP;
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
            initNetworkListener:initNetworkListener,
            dispatchNetworkChangeEvent:dispatchNetworkChangeEvent,
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

export default networkController;
