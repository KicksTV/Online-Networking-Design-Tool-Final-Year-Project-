
// COMPONENTS METHODS

const getterSetter = (state) => ({
    getID: () => {
        return state.id;
    },
    setID: (val) => {
        state.id = val;
    },
    getImage: () => {
        return state.image;
    },
    setImage: (val) => {
        state.image = val;
        return state.image;
    },
    getType: () => {
        return state.type;
    },
    setType: (val) => {
        state.type = val;
    },
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
        return state.image.width;
    },
    setWidth: (val) => {
        state.image.width = val;
    },
    // getWidthMin: () => {
    //     return state.widthMin;
    // },
    // getWidthMax: () => {
    //     return state.image.width+100;
    // },
    getHeight: () => {
        return state.image.height;
    },
    setHeight: (val) => {
        state.image.height = val;
    },
    getCenterPos: () => {
        return state.centerPos = [state.Xpos+(state.image.width/2), state.Ypos+(state.image.height/2)];
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
    getHasConnection: () => {
        return state.hasConnection;
    },
    setHasConnection: (val) => {
        state.hasConnection = val;
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
    getValidLinkingComponent: (index) => {
        return state.validLinkingComponents[index];
    },
    setValidLinkningComponents: (comps) => {
        state.validLinkingComponents = comps;
    },
    addValidLinkningComponent: (comp) =>  {
        state.validLinkingComponents.push(comp);
    },
    getGuiParams: () => {
        state.guiParams = {
            'Name': state.componentName,
            'Width': state.image.width,
            'WidthMin': 65,
            'WidthMax': 200,
            'TextSize': state.textSize,
            'TextSizeMax': 32,
            'HideComponent': state.hideComponent,
            'HideConnections': state.hideConnections,
            'Lock': false,
            'Connections': allCons.getConnectionsRelatedToComp(allComps.getSelectedComponent()),
        };
        return state.guiParams;
    },
    checkValidLinkingComponent: (comp) => {
        var isValid = false;
        state.validLinkingComponents.forEach((c)=> {
            if (comp.getType() == c) {
                isValid = true;
            }
        });
        return isValid;
    },
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
        
        if ((windowWidth- 240) > (x + state.image.width) && 0 < x) {
            state.Xpos = x;
        }
        if (windowHeight > (y + state.image.height) && 0 < y) {
            state.Ypos = y;
        }
    },
    multiMove: (x, y) => {
        if ((windowWidth- 240) > (x + state.image.width) && 0 < (x + state.Xpos)) {
            state.Xpos += x;
        }
        if (windowHeight > (y + state.image.height) && 0 < (y + state.Ypos)) {
            state.Ypos += y;
        }
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