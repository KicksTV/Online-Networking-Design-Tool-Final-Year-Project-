// Mixin
import {connectionMixin} from '../mixin/mixin.js';

import Device from './device.js';

export default class Connection extends connectionMixin(Device) {
    /**
         * Attributes. Created when a connection component is successfully linked between two device components.
         * @param this.id                 {Number}          To be able to uniquely identify a connection.
         * @param this.name               {String}          The name of cable is being used e.g. fibre or Twisted Pair.
         * @param this.type               {String}          What type of component is this? e.g. device or cable.
         * @param this.mousePos           {Array}           The inital mouse clicks when setup of connection between device components.
         * @param this._components        {Array}           The components that have been linked together.
         * @param this._interfacePorts    {Array}           The interface and the selected port to make the connection between the two components.
    */
    constructor(id, name, type) {
        super(id, name, type);
        this.mousePos = [0, 0];
        // [comp1, comp2]
        this._components = [];
        // [[interface object, port number], [interface object, port number]] - First object in is comp1
        this._interfacePorts = [];
    }
    x1() {
        return this._components[0].x
    }
    y1() {
        return this._components[0].y
    }
    x2() {
        return this._components[1].x
    }
    y2() {
        return this._components[1].y
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
    /**
         * Returns an interface object
         * @param index    {Number}    The Interface and Port wanting to be fetched from array.
         * @returns        {Object}    An interface object for the index in the array.
    */
    getInterface(index)  {
        try {
            return this._interfacePorts[index][0];
        } catch(err) {
            throw `Error: could not get interfacePorts - ${err}`;
        }
    }
    /**
         * Returns an array containing the interface and port used to make a connection.
         * @param index    {Number}    The Interface and Port wanting to be fetched from array.
         * @returns        {Object}    An array containing the interface and port for a particular component.
    */
    // Gets interface and port in array
    getInterfacePort(index)  {
        return this._interfacePorts[index];
    }
    /**
         * Get an IP address assigned to device
         * @param index      {Number}    Fetch component at index
         * @returns          {String}    The IP address for that port.
    */
    getIPaddress(index) {
        let comp = this._components[index];
        // Connection will eventually be storing the Interface ID, not the object.
        let intface = this._interfacePorts[index][0];
        let port = this._interfacePorts[index][1];
        let foundInterface = comp._interfaces.find(i => i.id == intface.id);
        let ipaddress = typeof foundInterface.portIPaddress[port] != 'undefined' ? foundInterface.portIPaddress[port] : "";
        return ipaddress;
    }

}
