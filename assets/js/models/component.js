// Mixin
import mixin from '../mixin/mixin.js';
import Device from './device.js';

export default class Component extends mixin.componentMixin(Device) {
    constructor(id, name, type, path, image) {
        super(id, name, type);
        this.displayName = name;
        this.image;
        this.imgPath = path;
        this.x = 100;
        this.y = 100;
        this.width;
        this.height;
        this.aspectRatio = [];
        this.centerPos = [];
        this.textSize = 10;
        this.hide = false;
        this.hideConnections = false;
        this.lock = false;
        this.hasCon = false;
        this.isClicked = false;
        this.guiParams = null;

        // Default
        this.validLinkingComponents = ["Twisted_Pair"];

        if (image) {
            this.image = image;
            this.width = this.image.width;
            this.height = this.image.height;
            this.aspectRatio[0] = this.image.width;
            this.aspectRatio[1] = this.image.height;
        }
    }
    getImgPath() {
        return this.imgPath;
    }
    setImgPath(path) {
        this.imgPath = path;
    }
    getIMG() {
        return this.image;
    }
    setIMG(val) {
        this.image = val;
        this.width = this.image.width;
        this.height = this.image.height;
        this.aspectRatio[0] = this.image.width;
        this.aspectRatio[1] = this.image.height;
        return this.image;
    }
    getXpos() {
        return this.x;
    }
    setXpos(val) {
        this.x = val;
    }
    getYpos() {
        return this.y;
    }
    setYpos(val) {
        this.y = val;
    }
    getWidth() {
        return this.image.width;
    }
    setWidth(val) {
        this.image.width = val;
    }
    getHeight() {
        return this.image.height;
    }
    setHeight(val) {
        this.image.height = val;
    }
    getCenterPos() {
        return this.centerPos = [this.x+(this.image.width/2), this.y+(this.image.height/2)];
    }
    getHideComponent() {
        return this.hide;
    }
    setHideComponent(val) {
        this.hide = val;
    }
    getHideConnections() {
        return this.hideConnections;
    }
    setHideConnections(val) {
        this.hideConnections = val;
    }
    getIsClicked() {
        return this.isClicked;
    }
    setIsClicked(val) {
        this.isClicked = val;
    }
    hasConnection() {
        return this.hasCon;
    }
    setHasConnection(val) {
        this.hasCon = val;
    }
    getTextSize() {
        return this.textSize;
    }
    setTextSize(val) {
        this.textSize = val;
    }
    getValidLinkingComponent(index) {
        return this.validLinkingComponents[index];
    }
    setValidLinkningComponents(comps) {
        this.validLinkingComponents = comps;
    }
    addValidLinkningComponent(comp) {
        this.validLinkingComponents.push(comp);
    }
    getValidLinkingComponent(index) {
        return this.validLinkingComponents[index];
    }
    setValidLinkningComponents(comps) {
        this.validLinkingComponents = comps;
    }
    addValidLinkningComponent(comp) {
        this.validLinkingComponents.push(comp);
    }
    checkValidLinkingComponent(comp) {
        var isValid = false;
        this.validLinkingComponents.forEach((c)=> {
            if (comp.name == c) {
                isValid = true;
            }
        });
        return isValid;
    }
}