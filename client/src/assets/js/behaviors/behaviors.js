const p5 = require('p5');

(state) => ({
    display: () => {
        p5.image(state.image, state.Xpos, state.Ypos);
        p5.noStroke();
        p5.textSize(state.textSize);
        p5.text(state.componentName, state.Xpos, state.Ypos + state.image.height, state.image.width, 30);
        p5.textAlign(p5.CENTER, p5.CENTER);
    },
    reSize: (newWidth) => {
        state.image.height = newWidth * (state.image.height / state.image.width);
        state.image.width = newWidth;
    },
});

(state) => ({
    move: (x, y) => {
        x = x - (state.image.width/2);
        y = y - (state.image.height/2);
        
        if ((p5.windowWidth) > (x + state.image.width) && 0 < x) {
            state.Xpos = x;
        }
        if (p5.windowHeight > (y + state.image.height) && 0 < y) {
            state.Ypos = y;
        }
    },
    multiMove: (x, y) => {
        if ((p5.windowWidth) > (x + state.image.width) && 0 < (x + state.Xpos)) {
            state.Xpos += x;
        }
        if (p5.windowHeight > (y + state.image.height) && 0 < (y + state.Ypos)) {
            state.Ypos += y;
        }
    }
});

(state) => ({
    clicked: () => {
        var d = p5.dist(state.Xpos + (state.image.width/2), state.Ypos + (state.image.height/2), p5.mouseX, p5.mouseY);
        if (d < (state.image.width/2)) {
            state.isClicked = true;
        }else {
            state.isClicked = false;
        }
        return state.isClicked;
    }

});

(state) => ({
    prepareForJson: () => {
        let parms = {
            "id": state.id,
            "imgPath": state.imgPath,
            "type": state.type,
            "Xpos": state.Xpos,
            "Ypos": state.Ypos,
            "width": state.image.width,
            "height": state.image.height,
            "hideComponent": state.hideComponent,
            "hideConnections": state.hideConnections,
            "componentName": state.componentName,
            "textSize": state.textSize,
            "validLinkingComponents": state.validLinkingComponents,
        }
        return parms;
    }
});
// Buttons methods
const buttonDisplayer = (state) => ({
    display: () => {
        state.li.style('display', 'inline-block');
    },
    hide: () => {
        state.li.hide();
    }
});

export default buttonDisplayer