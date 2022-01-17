import p5Controller from '../controller/p5Controller.js';

export const componentMixin = superclass => class extends superclass {
    applyAspectRatio() {
        this.image.height = this.image.width * (this.image.height / this.width);
        this.width = this.image.width;
    }
    multiMove(x, y) {
        var p5 = p5Controller.getCanvas()
        if ((p5.width) > (this.x + this.image.width + x) && 0 < (x + this.x)) {
            this.x += x;
        }
        if (p5.height > (this.y + this.image.height + y) && 0 < (y + this.y)) {
            this.y += y;
        }
    }
    
    clicked(mouseX, mouseY) {
        
        var d = p5Controller.useFunc("dist")(this.x + (this.image.width/2), this.y + (this.image.height/2), mouseX, mouseY);
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

export const connectionMixin = superclass => class extends superclass {
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

export default {componentMixin, connectionMixin}

