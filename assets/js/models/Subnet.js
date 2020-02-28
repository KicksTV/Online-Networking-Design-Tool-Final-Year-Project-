class Subnet {
    constructor() {
        this.subnetID = null;
        this.gatewayRouterID = null;
        this.gatewayRouterIP = null;
        this.endDevices = [];


        // Only temp NEEDS TO BE CHANGED to ID of CONNECTION!!
        this.connection = null;
    }

    add(deviceID) {
        this.endDevices.push(deviceID);
    }
}
