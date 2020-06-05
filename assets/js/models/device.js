class Device {
    constructor(id, name, type) {
        this.id = null;
        this.name = name;
        this.type = type;
        this._interfaces = [];

        if (!id) {
            let val = Math.floor(1000 + Math.random() * 900000);
            let name = this.name;
            name = name.replace(/\s/g, "_");
            this.id = `${name}${val}`;
        }
        else if (id != null) {
            this.id = id;
        }
    }
    getID() {
        return this.id;
    }
    setID(val) {
        this.id = val;
    }
    getType() {
        return this.type;
    }
    setType(val) {
        this.type = val;
    }
    addInterface(inter) {
        this._interfaces.push(inter);
    }
    getInterface(index) {
        return this._interfaces[index];
    } 
    getInterfaces() {
        return this._interfaces;
    }
    hasAvailablePort() {
        var hasAvailablePort = false;
        this._interfaces.forEach((i) => {
            if (i.availablePorts > 0) {
                hasAvailablePort = true;
            }
        });
        return hasAvailablePort;
    }
    hasInterface(thisInterface) {
        var hasInterface = false;
        this._interfaces.forEach(listedInterface => {
            if (listedInterface.portType.includes(thisInterface)) {
                hasInterface = true;
            }
        });

        return hasInterface;
    }
    getInterfaceFromString(string) {
        var foundInterface = null;
        var index = 0;
        this._interfaces.forEach(i => {
            i.ports.forEach(p => {
                if (p == string) {
                    foundInterface = i;
                    index = i.ports.indexOf(p);
                }
            });
        });
        return [foundInterface,index];
    }
    injectInterfaceSavedData(thisInterface) {
        this._interfaces.forEach(nextInterface => {
            if (thisInterface.type == nextInterface.type) {
                nextInterface.id = thisInterface.id;
                nextInterface.portAvailability = thisInterface.portAvailability;
                nextInterface.portIPaddress = thisInterface.portIPaddress;
            }
        });
    }
}

module.exports = Device;