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
         * @param this._components         {Array}           The components that have been linked together.
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
        return this._interfacePorts[index][0];
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

}
