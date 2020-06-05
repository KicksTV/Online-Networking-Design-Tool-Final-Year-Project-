// Components Bar Component and Connection Mixin 
const compBarGetSetMixin = superclass => class extends superclass {
    init() {
        print(this.title);
        this.ul.addClass('navbar-nav mr-auto');
        this.ul.id(`${this.title}navbar-component`);
        this.ul.parent('componentsNav');
    }
    getTitle() {
        return this.title;
    }
    setTitle(t) {
        this.title = t;
    }
    getButtons(){
        return this.buttons;
    }
    getUL() {
        return this.ul;
    }
    add(b) {
        this.buttons.push(b);
    }
};
const componentMixin = superclass => class extends superclass {
    display() {
        image(this.image, this.x, this.y);
        noStroke();
        textSize(this.textSize);
        text(this.displayName, this.x, this.y + this.image.height, this.image.width, 30);
        textAlign(CENTER, CENTER);
    }

    applyAspectRatio() {
        this.image.height = this.image.width * (this.image.height / this.width);
        this.width = this.image.width;
    }
    
    move(x, y) {
        x = x - (this.image.width/2);
        y = y - (this.image.height/2);
        
        if ((windowWidth) > (x + this.image.width) && 0 < x) {
            this.x = x;
        }
        if (windowHeight > (y + this.image.height) && 0 < y) {
            this.y = y;
        }
    }
    multiMove(x, y) {
        if ((windowWidth) > (x + this.image.width) && 0 < (x + this.x)) {
            this.x += x;
        }
        if (windowHeight > (y + this.image.height) && 0 < (y + this.y)) {
            this.y += y;
        }
    }
    
    clicked(mouseX, mouseY) {
        var d = dist(this.x + (this.image.width/2), this.y + (this.image.height/2), mouseX, mouseY);
        if (d < (this.image.width/2)) {
            this.isClicked = true;
        }else {
            this.isClicked = false;
        }
        return this.isClicked;
    }
    prepareForJson() {
        let parms = {
            "id": this.id,
            "name": this.name,
            "displayName": this.displayName,
            "imgPath": this.imgPath,
            "type": this.type,
            "x": this.x,
            "y": this.y,
            "width": this.image.width,
            "height": this.image.height,
            "hide": this.hide,
            "hideConnections": this.hideConnections,
            "textSize": this.textSize,
        }
        return parms;
    }
};

const connectionMixin = superclass => class extends superclass {
    compSelectDisplay()  {
        let centerPos = this._components[0].getCenterPos();
        let x = centerPos[0];
        let y = centerPos[1];
        push();
        stroke('black');
        strokeWeight(2);
        line(x, y, this.mousePos[0], this.mousePos[1]);
        pop();
    }
    defaultDisplay()  {
        let centerPos1 = this._components[0].getCenterPos();
        let centerPos2 = this._components[1].getCenterPos();
        let x1 = centerPos1[0];
        let y1 = centerPos1[1];
        let x2 = centerPos2[0];
        let y2 = centerPos2[1];

        push();
        stroke('black');
        line(x1, y1, x2, y2);
        pop();
    }
    isHidden()  {
        let comp1 = this._components[0];
        let comp2 = this._components[1];

        if (comp1.getHideConnections() || comp2.getHideConnections()) {
            return true;
        }
        return false;
    }
    prepareForJson()  {

        let _comps = [this.getComponent(0).id, this.getComponent(1).id];

        let parms = {
            "id": this.id,
            "name": this.name,
            "type": this.type,
            "mousePos": this.mousePos,
            "_components": _comps,
            "_interfacePorts": this._interfacePorts,
        }
        return parms;
    }
};
const panelMixin = superclass => class extends superclass {
    
};

module.exports = {componentMixin, connectionMixin, compBarGetSetMixin};

