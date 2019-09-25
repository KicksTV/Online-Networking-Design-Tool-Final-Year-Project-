let counter = 0;

class Computer {
    constructor() {
        this.imgPath = loadImage('img/pc.svg');
        this.imgXpos = 100;
        this.imgYpos = 100;
        this.componentSize = 65;
        this.height = this.componentSize / 1.2;
        this.componentSizeMin = 65;
        this.componentSizeMax = 200;
        this.hideComponent = false;
        this.isClicked = false;
        
        counter++;
        this.componentName = `Computer_${counter}`;
        this.textSize = 10;
        this.gui;
        

    }
    clicked(mouseX, mouseY) {
        var d = dist(this.imgXpos, this.imgYpos, mouseX, mouseY);
        
        if (d < this.componentSize) {
            this.isClicked = true;
        }else {
            this.isClicked = false;
        }
        return this.isClicked;
    }
    display() {


        image(this.imgPath, this.imgXpos, this.imgYpos, this.componentSize, this.height);
        textSize(this.textSize);
        text(this.componentName, this.imgXpos, this.imgYpos + this.componentSize + 5, this.componentSize, 30);
        textAlign(CENTER, CENTER);
    }
    move(x, y) {
        clear();

        x = x - (this.componentSize/2);
        y = y - (this.componentSize/2);

        redraw();
        this.imgXpos = x;
        this.imgYpos = y;
    }



    prepareForJson() {
        let parms = {
            "imgXpos": this.imgXpos,
            "imgYpos": this.imgYpos,
            "componentSize": this.componentSize,
            "hideComponent": this.hideComponent
        }

        return parms;
    }
    
}