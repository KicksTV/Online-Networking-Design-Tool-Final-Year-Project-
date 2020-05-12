class Interface extends componentMixin(Device) {
    constructor(id, type, numPorts) {
        super(id ,type);
        this.portType = type;
        this.bandwidth;
        this.numberOfPorts = numPorts;
        this.availablePorts = numPorts;

        // port name - which maps to availability and ip address below
        this.ports = [];
        // port availability i.e. if port currently has cable plugged in
        this.portAvailability = [];
        // port IP address i.e. if port currently has ip address
        this.portIPaddress = [];

        for (var i=0;i<=this.numberOfPorts;i++) {
            var port = this.portType + " " + i;
            this.portAvailability.push(true);
            this.ports.push(port);
        }
    }
    portInUse(portNumber) {
        this.portAvailability[portNumber] = false;
    }
    subtractPossibleAvailablePort() {
        this.availablePorts-1;
    }
}
