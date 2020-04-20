class Component extends componentMixin(Device) {
    constructor(type, path, image) {
        super(type);
        this.imgPath = path;
        this.image = image;
        this.Xpos = 100;
        this.Ypos = 100;
        this.aspectRatio = [];
        this.centerPos = [];
        this.hideComponent = false;
        this.hideConnections = false;
        this.hasCon = false;
        this.isClicked = false;
        this.componentName = `${type}`;
        this.textSize = 10;
        this.guiParams = null;
        this.validLinkingComponents = ["Twisted Pair"];

        this.aspectRatio[0] = this.image.width;
        this.aspectRatio[1] = this.image.height;
    }
    getImgPath() {
        return this.imgPath;
    }
    setImgPath(path) {
        this.imgPath = path;
    }
    getImage() {
        return this.image;
    }
    setImage(val) {
        this.image = val;
        return this.image;
    }
    getXpos() {
        return this.Xpos;
    }
    setXpos(val) {
        this.Xpos = val;
    }
    getYpos() {
        return this.Ypos;
    }
    setYpos(val) {
        this.Ypos = val;
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
        return this.centerPos = [this.Xpos+(this.image.width/2), this.Ypos+(this.image.height/2)];
    }
    getHideComponent() {
        return this.hideComponent;
    }
    setHideComponent(val) {
        this.hideComponent = val;
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
    getComponentName() {
        return this.componentName;
    }
    setComponentName(val) {
        this.componentName = val;
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
            if (comp.getType() == c) {
                isValid = true;
            }
        });
        return isValid;
    }
}