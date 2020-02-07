class ComponentsBarItem {
    constructor(title) {
        this.title = title;
        this.buttons = [];
        this.ul = createElement('ul', '');
    }
}

function componentsBarTab (title, width, height, bar) {
    let state = {
        title,
        width,
        height,

        bar,
        // CREATING NEW HTML ELEMENTS
        
        "li": createElement('li', ''),
        "a": createElement('a',title),
    }

    
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
        },
        getTitle: () => {
            return state.title;
        }
    });

    const switchBehavior = (state) => ({
        switchCurrent: () => {
            allTabs.hideCurrentButtons();
            allTabs.unsetVisableCurrent();
            state.bar.displayAllButtons();
            allTabs.setVisableCurrent(state);
        }
    });

    // Private attributes/methods
    Object.assign(
        state,
        switchBehavior(state),
        componentBarGetterAndSetter(state),
    );
    return Object.assign(
        componentBarGetterAndSetter(state),
    );
}

class ComponentBarComponents extends compBarGetSetMixin(ComponentsBarItem) {

    displayAllButtons() {

        this.ul.show();

        // LOOPS THROUGH ALL BUTTONS AND DISPLAY's EACH ONE
        
        for (let i=0; i < this.buttons.length; i++) {
    
            this.buttons[i].display();
    
            // ADDS BUTTON ELEMENT TO NAVBAR

            this.buttons[i].getLI().parent(`${this.title}navbar-component`);
            
    
            // CREATES A NEW COMPONENT WHEN COMPONENT BUTTON IS CLICKED
            this.buttons[i].getIMG().mousePressed(() => {
    
                allComps.setDraggingNewComponent(true);

                // CREATES NEW COMPONENT

                var path = this.buttons[i].getImgPath();
                var type = this.buttons[i].getComponentType();

                loadImage(path, img => {
                    img.width = img.width/2;
                    img.height = img.height/2;
                    let newcomp = Component(type, path, img).init();
                    
                    // NEED FUCNTION TO LOAD COMP PROPORTIES
                    
                    //TEMP needs to be removed!!!!!!!!!!!!!!!!
                    if (newcomp.getType() == "Smartphone") {
                        newcomp.setValidLinkningComponents([]);
                    }
                    
                    
                    allComps.setNewlyCreatedComp(newcomp);
                    // ADDS IT TO ARRAY OF ALL components
                    allComps.add(newcomp);

                    networkPropertiesGUIContainer.dispatchEvent(networkChangeEvent);
                });
            });
            // CREATES A NEW COMPONENT WHEN COMPONENT BUTTON IS DRAGGED
            // state.buttons[i].getIMG().mouseClicked(() => {

            // });
        }
        
    }
}


class ComponentBarConnections extends compBarGetSetMixin(ComponentsBarItem) {

    displayAllButtons() {

        this.ul.show();

        // LOOPS THROUGH ALL BUTTONS AND DISPLAY's EACH ONE
        
        for (let i=0; i < this.buttons.length; i++) {
    
            this.buttons[i].display();
    
            // ADDS BUTTON ELEMENT TO NAVBAR
    
            this.buttons[i].getLI().parent(`${this.title}navbar-component`);
            
    
            // CREATES A NEW COMPONENT
    
            this.buttons[i].getIMG().mouseClicked(() => {
                let c;
                if (allCons.getDrawConnection()) {
                    c = allCons.getSelectedConnection();
                    c.setType(this.buttons[i].getComponentType());
                }else {
                    c = Connection();
                    c.setType(this.buttons[i].getComponentType());
                    allCons.setDrawConnection(true);
                    allCons.setSelectedConnection(c);
                }
                alert("Please select two components!");
                
            });
        }
    }
    
}