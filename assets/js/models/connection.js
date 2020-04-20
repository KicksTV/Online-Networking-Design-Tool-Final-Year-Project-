class Con extends connectionMixin(Device) {
    constructor(type) {
        super(type);
        this.mousePos = [0, 0];
        this._components = [];
        this._interfacePorts = [];
    }
    getMousePos()  {
        return this.mousePos;
    }
    setMousePos(x, y)  {
        this.mousePos = [x, y];
    }
    addComponent(comp)  {
        this._components.push(comp);
    }
    getComponents()  {
        return this._components;
    }
    getComponent(index)  {
        return this._components[index];
    }
    setComponent(index, val)  {
        this._components[index] = val;
    }
    addInterfacePort(values)  {
        this._interfacePorts.push(values);
    }
    getInterface(index)  {
        return this._interfacePorts[index][0];
    }
    getInterfacePort(index)  {
        return this._interfacePorts[index];
    }
}