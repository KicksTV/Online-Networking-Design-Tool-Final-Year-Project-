export default class Subnet {
    constructor() {
        this.subnetID = null;
        this.gatewayRouterID = null;
        this.gatewayRouterIP = null;
        this.endDevices = [];
        this.unavailableAddresses = [];


        // Only temp NEEDS TO BE CHANGED to ID of CONNECTION!!
        this.connectionID = null;
    }
    createSubnet(endDevices) {
        if (this.endDevices.length != 0) {
            // Get the difference between old array and new array.

            // print("endDevices: ", endDevices);
            // print("this.endDevices: ", this.endDevices);
            let difference = this.endDevices.filter(x => !endDevices.includes(x));
            // print("Difference: ", difference);

            for (let comp of difference) {
                var index = this.endDevices.indexOf(comp);
                // Remove address
                // print("index", index);
                // print(this.endDevices);
                this.unavailableAddresses[index] = null;
            }
            this.unavailableAddresses = this.unavailableAddresses.filter(ip => ip != null);
        }

        // Set new end devices
        this.setEndDevices(endDevices);
    }
    setEndDevices(array) {
        this.endDevices = array;
    }
    add(deviceID) {
        console.log("deviceID",deviceID)
        this.endDevices.push(deviceID);

        this.unavailableAddresses.push(null);
    }
    getEndDevice(index) {
        return this.endDevices[index];
    }
    addAddressToSubnet(endDevice, ip) {
        let index = this.endDevices.indexOf(endDevice);

        this.unavailableAddresses[index] = ip;
    }
}