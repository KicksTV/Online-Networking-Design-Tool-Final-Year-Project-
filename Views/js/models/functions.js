
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
    getHideConnections: () => {
        return state.hideConnections;
    },
    setHideConnections: (val) => {
        state.hideConnections = val;
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
    setGUI: (gui) => {
        state.gui = gui;
    },
    getGUI: () => {
        return gui;
    },
    getGuiParams: () => {
        state.guiParams = {
            'Name': state.componentName,
            'Width': state.width,
            'TextSize': state.textSize,
            'TextSizeMax': 32,
            'WidthMin': state.widthMin,
            'WidthMax': state.widthMax,
            'HideComponent': state.hideComponent,
            'HideConnections': state.hideConnections,
            'Lock': false,
            'Connections': allCons.getConnectionsRelatedToComp(selectedComponent),
        };
        return state.guiParams;
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
        
        if ((windowWidth- 240) > (x + state.width) && 0 < x) {
            state.Xpos = x;
        }
        if (windowHeight > (y + state.height) && 0 < y) {
            state.Ypos = y;
        }
    }
});

const prepareForJson = (state) => ({
    prepareForJson: () => {
        let parms = {
            "imgPath": state.imgPath,
            "type": state.type,
            "Xpos": state.Xpos,
            "Ypos": state.Ypos,
            "width": state.width,
            "height": state.height,
            "hideComponent": state.hideComponent,
            "hideConnections": state.hideConnections,
            "componentName": state.componentName,
            "textSize": state.textSize,
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
    display: () => {
        state.li.style('display', 'inline-block');
    },
    hide: () => {
        state.li.hide();
    }
});

const buttonGetterSetter = (state) => ({
    getComponentType: () => {
        return state.componentType;
    },
    setComponentType: (type) => {
        state.componentType = type;
    },
    getImgPath: () => {
        return state.imgPath;
    },
    getLI: () => {
        return state.li;
    },
    getIMG: () => {
        return state.img;
    }
});