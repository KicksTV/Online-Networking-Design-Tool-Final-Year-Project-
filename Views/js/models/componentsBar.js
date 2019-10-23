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

    const switchBehavior = (state) => ({
        switchCurrent: () => {
            state.hideButtons();
            state.unsetVisableCurrent();
            state.bar.displayAllButtons();
            state.setVisableCurrent();
        }
    });


    // Private attributes/methods
    
    Object.assign(
        state,
        userInteractBehavior(state),
        switchBehavior(state),
        componentBarGetterAndSetter(state),
        componentBarTabDisplayer(state),
    );
    return Object.assign(
        componentBarGetterAndSetter(state),
        componentBarTabDisplayer(state),
    );
}





function compentsBarComponents(title) {
    let state = {
        title,
        "buttons": [],
        "ul": createElement('ul', ''),
    }

    const displayBarBehaviors = (state) => ({
        displayAllButtons: () => {
    

            state.ul.show();
    
            // LOOPS THROUGH ALL BUTTONS AND DISPLAY's EACH ONE
            
            for (let i=0; i < state.buttons.length; i++) {
        
                state.buttons[i].display();
        
                // ADDS BUTTON ELEMENT TO NAVBAR

                state.buttons[i].getLI().parent(`${state.title}navbar-component`);
                
        
                // CREATES A NEW COMPONENT
        
                state.buttons[i].getIMG().mouseClicked(() => {
                    
                    let newcomp;
        
                    // CREATES NEW COMPUTER

                    if (state.buttons[i].getComponentType() == "pc") {
                        newcomp = Computer();
                    }
                    else if (state.buttons[i].getComponentType() == "switch") {
                        newcomp = Switch();
                    }
                    else if (state.buttons[i].getComponentType() == "router") {
                        newcomp = Router();
                    }
        
                    // ADDS IT TO ARRAY OF ALL COMPUTERS
        
                    allComponents.push(newcomp);
                });
            }
            
        },
    });

    Object.assign(
        state,
    );

    return Object.assign(
        displayBarBehaviors(state),
        getterAndSetter(state),
    );
}

function componentsBarConnections(title) {
    let state = {
        title,

        "buttons": [],
        "ul": createElement('ul', ''),
    }

    const displayBarBehaviors = (state) => ({
        displayAllButtons: () => {
    
            state.ul.show();
    
            // LOOPS THROUGH ALL BUTTONS AND DISPLAY's EACH ONE
            
            for (let i=0; i < state.buttons.length; i++) {
        
                state.buttons[i].display();
        
                // ADDS BUTTON ELEMENT TO NAVBAR
        
                state.buttons[i].getLI().parent(`${state.title}navbar-component`);
                
        
                // CREATES A NEW COMPONENT
        
                state.buttons[i].getIMG().mouseClicked(() => {
                    if (allCons.getDrawConnection()) {
                        c = allCons.getSelectedConnection();
                        c.setType(state.buttons[i].getComponentType());
                    }else {
                        c = Connection();
                        c.setType(state.buttons[i].getComponentType());
                        allCons.setDrawConnection(true);
                    }
                    allCons.add(c);
                });
            }
        },
    });

    const drawBehavior = (state) => ({
        isDrawingConnection: () => {
            
        }
    });

    Object.assign(
        state,
    );

    return Object.assign(
        displayBarBehaviors(state),
        getterAndSetter(state),
    );
}