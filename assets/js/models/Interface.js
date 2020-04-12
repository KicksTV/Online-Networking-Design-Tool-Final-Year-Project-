class Comp {
    constructor(type, path, image) {
        this.id = null;
        this.imgPath = path;
        this.image = image;
        this.type = type;
        this.Xpos = 100;
        this.Ypos = 100;
        this.aspectRatio = [];
        this.centerPos = [];
        this.hideComponent = false;
        this.hideConnections = false;
        this.hasCon = false;
        this.isClicked = false;
        this.componentName = `${type}_${counter}`;
        this.textSize = 10;
        this.guiParams = null;
        this.validLinkingComponents = ["Twisted Pair"];

        var val = Math.floor(1000 + Math.random() * 900000);
        this.id = `${this.componentName}${val}`;
        
        //this.aspectRatio[0] = this.image.width;
        //this.aspectRatio[1] = this.image.heigt;

        
    }
}
class Interface extends componentMixin(Comp) {
    constructor(type, path, image, numPorts) {
        super(type, path, image);
        this.portType = type;
        this.bandwidth;
        this.numberOfPorts = numPorts;
        this.availablePorts = numPorts;
        this.ports = [];
        this.portAvailability = [];
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
