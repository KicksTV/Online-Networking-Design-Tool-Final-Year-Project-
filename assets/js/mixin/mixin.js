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
        image(this.image, this.Xpos, this.Ypos);
        noStroke();
        textSize(this.textSize);
        text(this.componentName, this.Xpos, this.Ypos + this.image.height, this.image.width, 30);
        textAlign(CENTER, CENTER);
    }
    reSize(newWidth) {
        this.image.height = newWidth * (this.image.height / this.image.width);
        this.image.width = newWidth;
    }
    
    move(x, y) {
        x = x - (this.image.width/2);
        y = y - (this.image.height/2);
        
        if ((windowWidth) > (x + this.image.width) && 0 < x) {
            this.Xpos = x;
        }
        if (windowHeight > (y + this.image.height) && 0 < y) {
            this.Ypos = y;
        }
    }
    multiMove(x, y) {
        if ((windowWidth) > (x + this.image.width) && 0 < (x + this.Xpos)) {
            this.Xpos += x;
        }
        if (windowHeight > (y + this.image.height) && 0 < (y + this.Ypos)) {
            this.Ypos += y;
        }
    }
    
    clicked() {
        var d = dist(this.Xpos + (this.image.width/2), this.Ypos + (this.image.height/2), mouseX, mouseY);
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
            "imgPath": this.imgPath,
            "type": this.type,
            "Xpos": this.Xpos,
            "Ypos": this.Ypos,
            "width": this.image.width,
            "height": this.image.height,
            "hideComponent": this.hideComponent,
            "hideConnections": this.hideConnections,
            "componentName": this.componentName,
            "textSize": this.textSize,
        }
        return parms;
    }
    getGUIProperties() {
        let parms = {
            "Xpos": this.Xpos,
            "Ypos": this.Ypos,
            "width": this.image.width,
            "height": this.image.height,
            "hideComponent": this.hideComponent,
            "hideConnections": this.hideConnections,
            "componentName": this.componentName,
            "textSize": this.textSize,
        }
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
        if (this._components[0].getHideConnections() || this._components[1].getHideConnections()) {
            return true;
        }
        return false;
    }
    prepareForJson()  {
        let complist = [];
        this._components.forEach(c => complist.push(c.prepareForJson()));

        

        let parms = {
            "id": this.id,
            "type": this.type,
            "mousePos": this.mousePos,
            "_components": complist,
            "_interfacePorts": this._interfacePorts,
        }
        return parms;
    }
};
