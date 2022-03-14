// Controllers
import componentController from '../controller/componentController.js';
import connectionController from '../controller/connectionController.js';
import projectSettingsController from '../controller/ProjectSettingsController.js';



// Collections
import allComponents from '../collections/allComponents.js';
import allConnections from '../collections/allConnections.js';
import allSubnets from '../collections/allSubnets.js';

// Models
import Graph from '../models/graph.js';
import Subnet from '../models/Subnet.js';

// const clone = require('rfdc')({ proto: false, circles: false })

const networkController = (function() {
    var instance;
    
    function init() {
     
        var networkObject = function () {
            this.hosts = 0;
            this.subnets = 0;

            // User inputted network properties
            this.subnetMask = "255.255.255.252";
            this.supernetMask = "255.255.255.248";


            this.available_Host_Addresses;
            this.available_subnets;
            this.available_IP_addresses = calculateTotalIPAddresses(this.subnetMask);
            this.available_subnets = calculateTotalNumberSubnets(this.supernetMask);

            this.calculated_subnetmask = calculateSubnetMask();
            this.calculated_supernetmask = calculateSupernetMask(this.subnets);

            this.autoCalculateMasks = true;

            this.calculateNetworkMasks = () => {
                let subnetmask = calculateSubnetMask();
                let supernetmask = calculateSupernetMask(this.subnets);
                this.calculated_subnetmask = subnetmask;
                this.calculated_supernetmask = supernetmask;

                if (this.autoCalculateMasks) {
                    this.subnetMask = subnetmask;
                    this.supernetMask = supernetmask;

                    this.available_IP_addresses = calculateTotalIPAddresses(subnetmask);
                    this.available_subnets = calculateTotalNumberSubnets(supernetmask);
                } else {
                    this.available_IP_addresses = calculateTotalIPAddresses(this.subnetMask);
                    this.available_subnets = calculateTotalNumberSubnets(this.supernetMask);
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
            var totalHosts = networkPropertiesPanel.add(network, 'available_IP_addresses').listen();
            var totalSubnets = networkPropertiesPanel.add(network, 'available_subnets').listen();

            var subnetController;
            var supernetController;

            if (! network.autoCalculateMasks) {
                subnetController = networkPropertiesPanel.add(network, 'subnetMask').listen();
                supernetController = networkPropertiesPanel.add(network, 'supernetMask').listen();
            } else {
                subnetController = networkPropertiesPanel.add(network, 'calculated_subnetmask').listen();
                supernetController = networkPropertiesPanel.add(network, 'calculated_supernetmask').listen();
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
            var supernetController = properties[5];
            var autoCalculateController = properties[6];

            subnetController.onChange(function(value) {

                network.autoCalculateMasks = false;
                
                // Fires on every change, drag, keypress, etc.
                if (projectSettingsController.obj('realtimeValidation')) {
                    if (! isValidSubnetMask(value)) {
                        this.domElement.firstElementChild.style.color = "red";
                    } else {
                        this.domElement.firstElementChild.style.color = "#1ed36f";
                    }
                }
            });
            subnetController.onFinishChange(function(value) {
                // Fires when a controller loses focus.
                // alert("The new value is " + value);

                // var oldValue = this.initialValue;

                network.subnetMask = value;

                if (projectSettingsController.obj('realtimeValidation')) {

                    // User wants to manually set masks
                    if (autoCalculateController.initialValue)
                        autoCalculateController.domElement.click();

                    if (isValidSubnetMask(value)) {
                        this.domElement.firstElementChild.classList.add('bg-success', 'text-white')
                    } else {
                        this.domElement.firstElementChild.classList.add('bg-danger', 'text-white')
                        // window.setTimeout(() => {
                        //     trigger change event
                        //     network.subnetMask = oldValue;
                        // }, 2000);
                    }

                    window.setTimeout(() => {
                        this.domElement.firstElementChild.classList.remove('bg-danger', 'text-white', 'bg-success')
                    }, 2000);
                }
            });

            supernetController.onChange(function(value) {

                // Fires on every change, drag, keypress, etc.
                if (projectSettingsController.obj('realtimeValidation')) {
                    if (! isValidSupernetMask(value)) {
                        this.domElement.firstElementChild.style.color = "red";
                    } else {
                        this.domElement.firstElementChild.style.color = "#1ed36f";
                    }
                }
            });
              
            supernetController.onFinishChange(function(value) {
                // Fires when a controller loses focus.

                // var oldValue = this.initialValue;
                network.supernetMask = value;

                if (projectSettingsController.obj('realtimeValidation')) {

                    // User wants to manually set masks
                    if (autoCalculateController.initialValue)
                        autoCalculateController.domElement.click();

                    if (isValidSupernetMask(value)) {
                        this.domElement.firstElementChild.classList.add('bg-success', 'text-white')
                    } else {
                        this.domElement.firstElementChild.classList.add('bg-danger', 'text-white')
                        // window.setTimeout(() => {
                        //     // trigger change event
                        //     network.supernetMask = oldValue;
                        // }, 2000);
                    }

                    window.setTimeout(() => {
                        this.domElement.firstElementChild.classList.remove('bg-danger', 'text-white', 'bg-success')
                    }, 2000);
                }
            });


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

        function getManualSubnetMask() {
            return network.subnetMask;
        }
        function getManualSupernetMask() {
            return network.supernetMask;
        }
        function getSubnetMask() {
            return network.calculated_subnetmask;
        }
        function getSupernetMask() {
            return network.calculated_supernetmask;
        }

        function initNetworkListener() {
            gui.domElement.addEventListener('networkChangeEvent', calculateAllNetworkProperties);
        }

        function dispatchNetworkChangeEvent() {
            componentController.getGUI().domElement.dispatchEvent(networkChangeEvent);
        }

        // network functions
        function calculateAllNetworkProperties() {
            network.hosts = calculateAllHost();
            network.subnets = calculateAllSubnets();

            network.calculateNetworkMasks();

            // print(network);
            console.log("network change event");
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

            var total_number_of_subnets = 0
            
            while (subnets > total_number_of_subnets) {
                for (let k=0; k<=i; k++) {
                    total_number_of_subnets += Math.pow(2, k);
                }
                total_number_of_subnets--;
                // Adding back the 1 that was taken away earlier
                supernetBits = (i-hostBits) + 1;
                i++;
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
            // var x = 2;
            var hosts = getLargestSubnet();

            // console.log(hosts);
            // Required hosts bits
            hosts += 1;
            //print("Number of hosts: " + hosts);

            // calculating the necessary host bits needed, includes id and broadcast addresses
            var i=0;

            while (hosts > Math.pow(2, i)-2) {
                // console.log("hosts", Math.pow(2, i)-2);
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

            // console.log(decimalNotationOfSubnetmask)

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
            for (i=0; i < 4 - numberOfOctets; i++) {
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
            allComponents.get().forEach((comp) => {
                if (componentController.isEndDevice(comp)) {
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
                    // console.log("binary", conversionToBinary);
                    let length = conversionToBinary.length;
                    let index = 1;
                    for (let char of conversionToBinary) {
                        if (char == '0') {
                            let bitPosition = length-index;
                            // console.log(bitPosition);
                            totalNumberOfHosts += Math.pow(2, bitPosition)
                        }
                        index++;
                    }   
                }
            });
            // console.log(totalNumberOfHosts)
            // Calculating totalNumberOfHosts with the addition of subnetID and broadcastID
            totalNumberOfHosts = totalNumberOfHosts - 2;
            // console.log(totalNumberOfHosts)

            // print("totalNumberOfHosts", totalNumberOfHosts);
            return totalNumberOfHosts;
        }

        // Calculates number of subnets currently on canvas
        function calculateAllSubnets() {
            var totalNumberOfSubnets = 0;
            var connections = [];
        
            for (let comp of allComponents.getAll()) {
                //print(comp.getComponentName());
                //print(allConnections.getConnectionsRelatedToComp(comp));
                if (comp.name == "Router") {
                    allConnections.getConnectionsRelatedToComp(comp).forEach((con) => {
                        connections.push(con);
                    });
                }
            }
            // console.log("connections", connections);
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
                    //console.log("binary", conversionToBinary);
                    let length = conversionToBinary.length;
                    let index = 1;
                    //print("hostBits", hostBits);
                    //print(conversionToBinary);
                    for (let char of conversionToBinary) {
                        let bitPosition = length-index;
                        //console.log(bitPosition);
                        if (char == '0' && bitPosition >= 1) {
                            //console.log("r ", Math.pow(2, bitPosition));
                            totalNumberOfSubnets += Math.pow(2, bitPosition)
                        }
                        index++;
                    }   
                }
            });
            //print("totalNumberOfSubnets", totalNumberOfSubnets);
            return totalNumberOfSubnets;
        }


        function getLargestSubnet() {
            var largestSubnet = 0;
            //Get all routers
            var allRouters = allComponents.get().filter(comp => comp.name.toLowerCase() == "router");

            for (let router of allRouters) {
                let connections = allConnections.getConnectionsRelatedToComp(router);
                // console.log(connections);
                for (let nextConnection of connections) {
                    var subnetHostSize = 0;
                    var searchingComp = null;
                    var adjacentRouter = null;

                    var currSubnet = null;
                    
                   
                    // console.log(allSubnets.getInstance().toList());

                    //console.log(foundSubnet);

                    // Getting adjacent component to router
                    nextConnection.getComponents().forEach( c => {
                        if (c != router) {
                            if (c.name != 'Router') {
                                searchingComp = c;
                            } else {
                                adjacentRouter = c;
                            }
                        }
                    })

                    var foundSubnet = allSubnets.getInstance().toList().find(subnet => 
                        subnet.gatewayRouterID.includes(router.id) && 
                        subnet.connectionID == nextConnection.id || 
                        adjacentRouter && subnet.gatewayRouterID.includes(adjacentRouter.id) && 
                        subnet.connectionID == nextConnection.id
                    );
                    
                    // Creating or finding subnet object
                    if (foundSubnet == null) {
                        // console.log("new");
                        currSubnet = new Subnet();
                        currSubnet.gatewayRouterID.push(router.id);
                        currSubnet.connectionID = nextConnection.id;
                        allSubnets.getInstance().add(currSubnet);
                    }
                    else {
                        // console.log("old");
                        currSubnet = foundSubnet;
                        if (!currSubnet.gatewayRouterID.includes(router.id)) { 
                            currSubnet.gatewayRouterID.push(router.id) 
                        }
                        if (adjacentRouter && !currSubnet.gatewayRouterID.includes(adjacentRouter.id)) { 
                            currSubnet.gatewayRouterID.push(adjacentRouter.id) 
                        }
                        currSubnet.connectionID = nextConnection.getID();
                    }

                    // console.log(currSubnet);

                    // if component exists, continue to find end devices.
                    if (searchingComp) {
                        let result = Graph.getInstance().depthFirstSearchForHostDevices(searchingComp.id, componentController.isEndDevice);
                        if (result != null) {
                            subnetHostSize = result.length;
                        }
                        if (subnetHostSize > largestSubnet) {
                            largestSubnet = subnetHostSize;
                        }
                        // console.log(result);
                        currSubnet.createSubnet(result);
                    }
                }

            }  
            // console.log("largest Subnet: " + largestSubnet);
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
            for (i=0; i<ANDresult.length;i+=8) {
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
            for (i=0; i<result.length;i+=8) {
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
            // Use to be this until vue complained about it
            // var regex = RegExp("(?:[0-9]{1,3}\.){3}[0-9]{1,3}");
            var regex = RegExp("(?:[0-9]{1,3}.){3}[0-9]{1,3}");
            if (regex.exec(value)) {
                isValid = true;
            } else {
                // $('#warningConnectionToastAlert').toast('show');
                // $('#warningConnectionToastAlert .toast-body').text(
                //     "Error: Invalid input! Example SubnetMask: 255.255.255.240"
                // );
                window.$vue.makeToast("IP Input", "Error: Invalid input! Example SubnetMask: 255.255.255.240", true)
            }
            return isValid;
        }

        function isValidSubnetMask(value) {
            var isValid = false;
            if (isValidInput(value)) {
                if (network.calculated_subnetmask) {

                    var calOctets = calculateSubnetMask().split(".");
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
                            window.$vue.makeToast("SubnetMask Input Error", "Require more host bits!", true)
                        }
                    }

                }
            }
            return isValid;
        }

        function isValidSupernetMask(value) {
            var isValid = false;
            if (isValidInput(value)) {
                if (network.calculated_supernetmask) {

                    var calOctets = calculateSupernetMask(network.calculated_subnetmask).split(".");
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
                            window.$vue.makeToast("SupernetMask Address Input", "Error: Require more host bits!", true)
                        }
                    }
                }
            }
            return isValid;
        }
        function checkValidIPAddress(connection) {
            var invalid_ipaddresses = []
            // Finding subnet related to selected component
            var foundSubnetforComp = null;
            allSubnets.getInstance().toList().forEach(s => {
                var found = s.endDevices.find(x => x.id == connection.getComponent(0).id || x.id == connection.getComponent(1).id);
                if (found != null) {
                    foundSubnetforComp = s;
                }
            });
            var ip_addresses = connection.getIPaddresses()

            for (var ip_address of ip_addresses) {
                // Get the number of octets currently IP address field
                var numberOfOctets = ip_address.split(".").length;

                // Array of octets
                var octets = ip_address.split(".");

                if (foundSubnetforComp) {
                    if (numberOfOctets == 4 && octets[0] != "" && octets[1] != "" && octets[2] != "" && octets[3] != "") {
                        // Checking for valid assignment of IP address.
                        let subnetmask = getSubnetMask();
                        var subnetID = calculateSubnetID(ip_address, subnetmask);
                        if (subnetID != foundSubnetforComp.subnetID) {
                            console.log("not valid ip address")
                            invalid_ipaddresses.push(ip_address)
                        }
                    }
                }
            }
            return invalid_ipaddresses
        }
        function checkIPAddressInput(event, connection) {
            var interfaceValues;
            var currentSelectedComp = componentController.getSelectedComponent();
            var key = String.fromCharCode(event.keyCode)

            // console.log(event);
            // console.log(allSubnets.getInstance().getAll())
            // console.log(allConnections.getAll())


            if (connection.getComponent(0) == currentSelectedComp) {
                interfaceValues = connection.getInterfacePort(0);
            }
            else if (connection.getComponent(1) == currentSelectedComp) {
                interfaceValues = connection.getInterfacePort(1);
            }

            var inter = interfaceValues[0];
            var port = interfaceValues[1];

            var routerComp = null;
            if (currentSelectedComp.name.toLowerCase() == "router") {
                routerComp = currentSelectedComp;
            }

            // Preventing characters other than numbers from being entered
            var regex = new RegExp("^[a-zA-Z]+$");
            if (regex.test(key)) {
                if (key.length == 1) {
                    event.preventDefault();
                }
            }
            if (key == "Enter") {
                event.preventDefault();
            }
            // print("Address entered");

            // Get all field content and last key pressed
            var IPaddressField = event.target.innerText + key;

            // console.log(IPaddressField);

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
                    
                    const found = allSubnets.getInstance().toList().find(x => x.gatewayRouterID.includes(routerComp.id) && x.connectionID === connection.id);
                    found.gatewayRouterIP = IPaddressField;

                    // Setting Subnet ID
                    let subnetmask = getSubnetMask();
                    found.subnetID = calculateSubnetID(found.gatewayRouterIP, subnetmask);

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

                    // console.log(foundSubnetforComp);

                    // Checks if router has been assigned an IP address first
                    if (foundSubnetforComp.gatewayRouterIP == null) {
                        event.preventDefault();
                        alert("Please assign an IP address to Default Gateway (Router) first.");
                    } else {
                        
                        if (numberOfOctets == 4 && octets[3] != "") {
                            // Checking for valid assignment of IP address.

                            let subnetmask = getSubnetMask();

                            var subnetID = calculateSubnetID(IPaddressField, subnetmask);
                            
                            // if project auto validation enabled
                            if (projectSettingsController.obj('realtimeValidation')) {
                                // Check against existing assign IP addresses
                                if (subnetID == foundSubnetforComp.subnetID && checkAvailableIPAddress(foundSubnetforComp, IPaddressField)) {
                                    
                                    // Valid IP address for subnet
                                    ipfield.className = "qs_valid_ip_address";
                                    inter.portIPaddress[port] = IPaddressField;

                                    foundSubnetforComp.addAddressToSubnet(currentSelectedComp, IPaddressField);

                                } else {
                                    
                                    // Not valid IP address for subnet

                                    ipfield.className = "qs_invalid_ip_address";

                                    // $('#warningConnectionToastAlert').toast('show');
                                    // $('#warningConnectionToastAlert .toast-body').text(
                                    //     "Invalid IP address for subnet!"
                                    // );
                                    window.$vue.makeToast("IP Input", "Invalid IP address for subnet!", true)
                                }
                            } else {
                                inter.portIPaddress[port] = IPaddressField;
                                foundSubnetforComp.addAddressToSubnet(currentSelectedComp, IPaddressField);
                            }
                        }
                    }
                } else {
                    window.$vue.makeToast("IP Input", "Device is not part of any subnet!", true)
                    // $('#warningConnectionToastAlert').toast('show');
                    // $('#warningConnectionToastAlert .toast-body').text(
                    //     "Device is not part of any subnet!"
                    // );
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


            var currentSelectedComp = componentController.getSelectedComponent();

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

        async function setupNetwork() {
            console.log("setup network")
          
            var list_of_routers = componentController.getAll().filter(c => c.name === 'Router');
            var list_of_PCs = componentController.getAll().filter(c => c.name === 'PC');
          
            var netswitch = componentController.getAll().find(c => c.name === 'Switch');
          
            // Creates a connection between all routers
            for (let r in list_of_routers) {
              if (r != list_of_routers.length-1) {
                var con = await connectionController.createNewConnection("twisted-pair");
                
                let num = parseInt(r);
                var num2 = num+1;
          
          
                let interfaceValues1 = list_of_routers[num].getInterfaceFromString(`Fast_Ethernet 1`);
                let interfaceValues2 = list_of_routers[num2].getInterfaceFromString("Fast_Ethernet 0");
          
                // var intface1 = list_of_routers[r].getInterface(0);
                // var intface2 = list_of_routers[r++].getInterface(0);
                con.addComponent(list_of_routers[num]);
                con.addComponent(list_of_routers[num2]);
                con.addInterfacePort(interfaceValues1);
                con.addInterfacePort(interfaceValues2);
                // con._interfaces = [[intface1, 0], [intface2, 0]];
          
                // get the interface.
                let inter1 = interfaceValues1[0];
                // get the port of that interface.
                let port1 = interfaceValues1[1];
                // port is now in use and cannot be selected.
                inter1.portInUse(port1);
          
                // get the interface.
                let inter2 = interfaceValues2[0];
                // get the port of that interface.
                let port2 = interfaceValues2[1];
                // port is now in use and cannot be selected.
                inter2.portInUse(port2);
                 
                // Creating new Edge on graph
                Graph.getInstance().addEdge(
                  list_of_routers[num].id, 
                  list_of_routers[num2].id
                );
          
                connectionController.add(con);
              }
            }
          
            // Router_1  -> Switch_1
            let connection1 = await connectionController.createNewConnection("twisted-pair");
            let interfaceValues1 = list_of_routers[0].getInterfaceFromString(`Fast_Ethernet 0`);
            let interfaceValues2 = netswitch.getInterfaceFromString("Fast_Ethernet 0");
            connection1.addComponent(list_of_routers[0]);
            connection1.addComponent(netswitch);
            connection1.addInterfacePort(interfaceValues1);
            connection1.addInterfacePort(interfaceValues2);
          
            // get the interface.
            let inter1 = interfaceValues1[0];
            // get the port of that interface.
            let port1 = interfaceValues1[1];
            // port is now in use and cannot be selected.
            inter1.portInUse(port1);
          
            // get the interface.
            let inter2 = interfaceValues2[0];
            // get the port of that interface.
            let port2 = interfaceValues2[1];
            // port is now in use and cannot be selected.
            inter2.portInUse(port2);
            
            // Creating new Edge on graph
            Graph.getInstance().addEdge(
              list_of_routers[0].id, 
              netswitch.id
            );
            connectionController.add(connection1);
          
            // Create a subnet between each router and pc execpt first router
            for (let i in list_of_routers) {
              if (i != 0) {
                let con = await connectionController.createNewConnection("twisted-pair");
                // con._components = [list_of_routers[i], list_of_PCs[i]];
          
                let interfaceValues1 = list_of_routers[i].getInterfaceFromString(`Fast_Ethernet 3`);
                let interfaceValues2 = list_of_PCs[i].getInterfaceFromString("Fast_Ethernet 0");
          
                con.addComponent(list_of_routers[i]);
                con.addComponent(list_of_PCs[i]);
                con.addInterfacePort(interfaceValues1);
                con.addInterfacePort(interfaceValues2);
          
                // get the interface.
                let inter1 = interfaceValues1[0];
                // get the port of that interface.
                let port1 = interfaceValues1[1];
                // port is now in use and cannot be selected.
                inter1.portInUse(port1);
          
                // get the interface.
                let inter2 = interfaceValues2[0];
                // get the port of that interface.
                let port2 = interfaceValues2[1];
                // port is now in use and cannot be selected.
                inter2.portInUse(port2);
          
                // Creating new Edge on graph
                Graph.getInstance().addEdge(
                  list_of_routers[i].id, 
                  list_of_PCs[i].id
                );
          
                connectionController.add(con);
              }
            }
          
            let list_of_end_devices = componentController.getAll().filter(c => 
                                                                    c.name === 'Laptop' ||
                                                                    c.name === 'Printer' ||
                                                                    c.name === 'Server');
          
            for (let endDevice of list_of_end_devices) {
                let index = list_of_end_devices.indexOf(endDevice);
              // index = 0 is already taken by connection with router
              if (index == 0) index++;
              let con = await connectionController.createNewConnection("twisted-pair");
          
              // endDevice.getInterface(0).portInUse(0);
              // endDevice.getInterface(0).portIPaddress[0] = `192.168.1.${list_of_end_devices.indexOf(endDevice)+1}`;
              let interfaceValues1 = endDevice.getInterfaceFromString("Fast_Ethernet 0");
              let interfaceValues2 = netswitch.getInterfaceFromString(`Fast_Ethernet ${index}`);
          
              con.addComponent(endDevice);
              con.addComponent(netswitch);
              con.addInterfacePort(interfaceValues1);
              con.addInterfacePort(interfaceValues2);
          
              // get the interface.
              let inter1 = interfaceValues1[0];
              // get the port of that interface.
              let port1 = interfaceValues1[1];
              // port is now in use and cannot be selected.
              inter1.portInUse(port1);
          
              // get the interface.
              let inter2 = interfaceValues2[0];
              // get the port of that interface.
              let port2 = interfaceValues2[1];
              // port is now in use and cannot be selected.
              inter2.portInUse(port2);
          
              // Creating new Edge on graph
              Graph.getInstance().addEdge(
                netswitch.getID(), 
                endDevice.getID()
              );
              connectionController.add(con);
            }
            dispatchNetworkChangeEvent();
        }

        function toJSON() {
            // Saving all subnets
            var json = allSubnets.getInstance().toJSON();
            console.log(json)
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
            calculateTotalIPAddresses:calculateTotalIPAddresses,
            calculateTotalNumberSubnets:calculateTotalNumberSubnets,
            calculateDecimalFromSlashValue:calculateDecimalFromSlashValue,
            binaryToDecimal:binaryToDecimal,
            decimalToBinary:decimalToBinary,
            calculateSubnetID:calculateSubnetID,
            getManualSubnetMask:getManualSubnetMask,
            getManualSupernetMask:getManualSupernetMask,
            getSubnetMask:getSubnetMask,
            getSupernetMask:getSupernetMask,
            isValidSupernetMask:isValidSupernetMask,
            isValidSubnetMask:isValidSubnetMask,
            checkValidIPAddress:checkValidIPAddress,
            checkIPAddressInput:checkIPAddressInput,
            checkAvailableIPAddress:checkAvailableIPAddress,
            setupNetwork:setupNetwork,
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

export default networkController.getInstance();
