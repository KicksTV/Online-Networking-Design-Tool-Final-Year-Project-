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
        state.img.addClass('componentImg');
        state.img.parent(state.li);

        state.li.style('display', 'inline-block');
    }
});

const userInteractBehavior = (state) => ({
    hideAllButtons: () => {
        for (var i=0;i<allComponentBarTabs.length;i++) {
            if (allComponentBarTabs[i].current) {
                allComponentBarTabs[i].bar.ul.hide();
            }
        } 
    },
    unsetCurrent: () => {
        for (var i=0;i<allTabs.length();i++) {
            if (allTabs.get(i).current) {
                allTabs.get(i).bar.current = false;
                allTabs.get(i).li.removeClass('active');
            }
        }
    }
});

// addButton(btn) {
//     this.buttons.add(btn);
// }



// ComponentsBar public methods

const componentBarGetterAndSetter = (state) => ({
    getBar: () => {
        return state.bar;
    },
    getCurrent: () => {
        return state.current;
    },
    setCurrent: (curr) => {
        state.li.addClass('active');
        state.bar.display();
        state.current = curr;
    },
    init: () => {
        state.li.mouseClicked(() => {
            state.unsetCurrent();
            state.hideAllButtons();
            state.bar.display();
            state.bar.displayAllButtons();
            state.setCurrent(true);
        });
    },
    
});

const componentBarDisplayer = (state) => ({
    display: () => {
        
        state.li.addClass('nav-item');
        state.a.addClass('nav-link');

        state.li.parent('navbar-component-links');
        state.a.parent(state.li);
    },
});