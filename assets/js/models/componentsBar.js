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
    
                compContrInstance.setDraggingNewComponent(true);

                // CREATES NEW COMPONENT

                var path = this.buttons[i].getImgPath();
                var type = this.buttons[i].getComponentType();

                loadImage(path, img => {
                    img.width = img.width/2;
                    img.height = img.height/2;
                    let newcomp = componentController.getInstance().createNewComponent(null, type, path, img);
                    
                    compContrInstance.setNewlyCreatedComp(newcomp);
                    // ADDS IT TO ARRAY OF ALL components
                    allComps.add(newcomp);

                    gui.domElement.dispatchEvent(networkChangeEvent);
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
                if (connectionController.getInstance().getDrawConnection()) {
                    c = allConnections.getInstance().getSelectedConnection();
                    c.setType(this.buttons[i].getComponentType());
                }else {
                    c = connectionController.getInstance().createNewConnection(null, this.buttons[i].getComponentType());

                    connectionController.getInstance().setDrawConnection(true);
                    allConnections.getInstance().setSelectedConnection(c);
                }
                $('#startConnectionToastAlert').toast('show');
                $('#startConnectionToastAlert .toast-body').text(
                    "Please select two commonents!"
                );
                
            });
        }
    }
    
}