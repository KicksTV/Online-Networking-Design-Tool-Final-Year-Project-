const component = () => {
    const imgPath = loadImage('img/pc.svg');
    var imgXpos = 100;
    var imgYpos = 100;
    var componentSize = 65;
    var height = this.componentSize / 1.2;
    var componentSizeMin = 65;
    var componentSizeMax = 200;
    var hideComponent = false;
    var isClicked = false;
    var counter = 0;
    counter++;
    var componentName = `Computer_${counter}`;
    var textSize = 10;
    var gui;

    return {
        clicked: () => {
            var d = dist(this.imgXpos, this.imgYpos, mouseX, mouseY);
            if (d < this.componentSize) {
                this.isClicked = true;
            }else {
                this.isClicked = false;
            }
            return this.isClicked;
        },
        display: () => {
            image(this.imgPath, this.imgXpos, this.imgYpos, this.componentSize, this.height);
            textSize(this.textSize);
            text(this.componentName, this.imgXpos, this.imgYpos + this.componentSize + 5, this.componentSize, 30);
            textAlign(CENTER, CENTER);
        },
        move: (x, y) => {
            clear();

            x = x - (this.componentSize/2);
            y = y - (this.componentSize/2);

            redraw();
            this.imgXpos = x;
            this.imgYpos = y;
        },
        prepareForJson: () => {
            let parms = {
                "imgXpos": this.imgXpos,
                "imgYpos": this.imgYpos,
                "componentSize": this.componentSize,
                "hideComponent": this.hideComponent
            }
            return parms;
        }
    }
}
