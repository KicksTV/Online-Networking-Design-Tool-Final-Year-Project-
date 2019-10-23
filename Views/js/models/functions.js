
// COMPONENTS METHODS

const getterSetter = (state) => ({
    getXpos: () => {
        return state.Xpos;
    },
    setXpos: (val) => {
        state.Xpos = val;
    },
    getYpos: () => {
        return state.Ypos;
    },
    setYpos: (val) => {
        state.Ypos = val;
    },
    getWidth: () => {
        return state.width;
    },
    setWidth: (val) => {
        state.width = val;
    },
    getWidthMin: () => {
        return state.widthMin;
    },
    getWidthMax: () => {
        return state.widthMax;
    },
    getHeight: () => {
        return state.height;
    },
    setHeight: (val) => {
        state.height = val;
    },
    getCenterPos: () => {
        return state.centerPos = [state.Xpos+(state.width/2), state.Ypos+(state.height/2)];
    },
    getHideComponent: () => {
        return state.hideComponent;
    },
    setHideComponent: (val) => {
        state.hideComponent = val;
    },
    getIsClicked: () => {
        return state.isClicked;
    },
    setIsClicked: (val) => {
        state.isClicked = val;
    },
    getComponentName: () => {
        return state.componentName;
    },
    setComponentName: (val) => {
        state.componentName = val;
    },
    getTextSize: () => {
        return state.textSize;
    },
    setTextSize: (val) => {
        state.textSize = val;
    },


});

const clicker = (state) => ({
    clicked: () => {
        var d = dist(state.Xpos + (state.width/2), state.Ypos + (state.height/2), mouseX, mouseY);
        if (d < (state.width/2)) {
            state.isClicked = true;
        }else {
            state.isClicked = false;
        }
        return state.isClicked;
    }

});

const componentDisplayer = (state) => ({
    display: () => {
        image(state.imgPath, state.Xpos, state.Ypos, state.width, state.height);
        textSize(state.textSize);
        text(state.componentName, state.Xpos, state.Ypos + state.height, state.width, 30);
        textAlign(CENTER, CENTER);
    }
});

const mover = (state) => ({
    move: (x, y) => {
        x = x - (state.width/2);
        y = y - (state.height/2);
        state.Xpos = x;
        state.Ypos = y;
    }
});

const prepareForJson = (state) => ({
    prepareForJson: () => {
        let parms = {
            "Xpos": state.Xpos,
            "Ypos": state.Ypos,
            "componentSize": state.width,
            "hideComponent": state.hideComponent
        }
        return parms;
    }
});





// Components Bar Tab Methods

const componentBarGetterAndSetter = (state) => ({
    getBar: () => {
        return state.bar;
    },
    init: () => {
        state.getLI().mouseClicked(() => {
            state.switchCurrent();
        });
        state.getBar().init();
        state.getBar().getUL().hide();
        
        state.li.addClass('nav-item');
        state.a.addClass('nav-link');

        state.li.parent('navbar-component-links');
        state.a.parent(state.li);
    },
    getLI: () => {
        return state.li;
    },
    getA: () => {
        return state.a;
    }
    
});

const componentBarTabDisplayer = (state) => ({
    setVisableCurrent: () => {
        state.getLI().addClass('active');

        allTabs.setCurrent(state);
    },
});

const userInteractBehavior = (state) => ({
    hideButtons: () => {
        allTabs.getCurrent().getBar().getUL().hide();
    },
    unsetVisableCurrent: () => {
        allTabs.getCurrent().getLI().removeClass('active');
    }
});



// Components Bar Components Methods

const getterAndSetter = (state) => ({
    init: () => {
        state.ul.addClass('navbar-nav mr-auto');
        state.ul.id(`${state.title}navbar-component`);
        state.ul.parent('componentsNav');
    },
    getTitle: () => {
        return state.title;
    },
    setTitle: (t) => {
        state.title = t;
    },
    getButtons: () => {
        return state.buttons;
    },
    getUL: () => {
        return state.ul;
    },
    add: (b) => {
        state.buttons.push(b);
    },
});


// Buttons methods

const buttonDisplayer = (state) => ({
    display() {
        state.img.addClass('componentImg');
        state.img.parent(state.li);

        state.li.style('display', 'inline-block');
    }
});

const buttonGetterSetter = (state) => ({
    getComponentType: () => {
        return state.componentType;
    },
    setComponentType: (type) => {
        state.componentType = type;
    },
    getLI: () => {
        return state.li;
    },
    getIMG: () => {
        return state.img;
    }
});