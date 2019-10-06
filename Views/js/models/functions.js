const clicker = (state) => ({
    clicked() {
        var d = dist(state.Xpos, state.Ypos, mouseX, mouseY);
        if (d < state.componentSize) {
            state.isClicked = true;
        }else {
            state.isClicked = false;
        }
        return state.isClicked;
    }

});

const componentDisplayer = (state) => ({
    display() {
        image(state.imgPath, state.Xpos, state.Ypos, state.componentSize, state.height);
        textSize(state.textSize);
        text(state.componentName, state.imgXpos, state.imgYpos + state.componentSize + 5, state.componentSize, 30);
        textAlign(CENTER, CENTER);
    }
});

const mover = (state) => ({
    move(x, y) {
        clear();
        x = x - (state.componentSize/2);
        y = y - (state.componentSize/2);
        redraw();
        state.Xpos = x;
        state.Ypos = y;
    }
});

const prepareForJson = (state) => ({
    prepareForJson() {
        let parms = {
            "Xpos": state.Xpos,
            "Ypos": state.Ypos,
            "componentSize": state.componentSize,
            "hideComponent": state.hideComponent
        }
        return parms;
    }
});

const buttonDisplayer = (state) => ({
    display() {
        let li = createElement('li', '');
        let img = createImg(this.imgPath, this.imgAlt);
        
        img.addClass('componentImg');
        img.parent(li);

        this.li = li;
        this.img = img;
    }
});