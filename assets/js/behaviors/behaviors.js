const componentDisplayer = (state) => ({
    display: () => {
        image(state.image, state.Xpos, state.Ypos);
        noStroke();
        textSize(state.textSize);
        text(state.componentName, state.Xpos, state.Ypos + state.image.height, state.image.width, 30);
        textAlign(CENTER, CENTER);
    },
    reSize: (newWidth) => {
        state.image.height = newWidth * (state.image.height / state.image.width);
        state.image.width = newWidth;
    },
});

const mover = (state) => ({
    move: (x, y) => {
        x = x - (state.image.width/2);
        y = y - (state.image.height/2);
        
        if ((windowWidth) > (x + state.image.width) && 0 < x) {
            state.Xpos = x;
        }
        if (windowHeight > (y + state.image.height) && 0 < y) {
            state.Ypos = y;
        }
    },
    multiMove: (x, y) => {
        if ((windowWidth) > (x + state.image.width) && 0 < (x + state.Xpos)) {
            state.Xpos += x;
        }
        if (windowHeight > (y + state.image.height) && 0 < (y + state.Ypos)) {
            state.Ypos += y;
        }
    }
});

const clicker = (state) => ({
    clicked: () => {
        var d = dist(state.Xpos + (state.image.width/2), state.Ypos + (state.image.height/2), mouseX, mouseY);
        if (d < (state.image.width/2)) {
            state.isClicked = true;
        }else {
            state.isClicked = false;
        }
        return state.isClicked;
    }

});

const prepareForJson = (state) => ({
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