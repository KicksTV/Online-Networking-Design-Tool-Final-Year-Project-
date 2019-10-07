function componentsBarLabel (title, width, height) {
    let state = {
        title,
        width,
        height,

        "bar": null,
        "current": false,

        // CREATING NEW HTML ELEMENTS
        
        "li": createElement('li', ''),
        "a": createElement('a',title),
    }

    const displayBarBehaviors = (state) => ({
        init: () => {
            state.li.mouseClicked(() => {
                state.hideAllButtons();
                state.bar.display();
                state.bar.displayAllButtons();
                state.setCurrent(true);
            });
        },
    });

    return Object.assign(
        state,
        displayBarBehaviors(state),
        compLabelDisplay(state),
        canBeCurrent(state),
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
        
                state.buttons[i].li.parent(`${state.title}navbar-component`);
                
        
                // CREATES A NEW COMPONENT
        
                state.buttons[i].img.mouseClicked(() => {
                    
                    let newcomp;
        
                    // CREATES NEW COMPUTER
        
                    if (state.buttons[i].componentType == "pc") {
                        newcomp = Computer();
                    }
                    else if (state.buttons[i].componentType == "switch") {
                        newcomp = Switch();
                    }
                    else if (state.buttons[i].componentType == "router") {
                        newcomp = Router();
                    }
        
                    // ADDS IT TO ARRAY OF ALL COMPUTERS
        
                    allComponents.push(newcomp);
                });
            }
            
        },
        display() {
            state.ul.addClass('navbar-nav mr-auto');
            state.ul.id(`${state.title}navbar-component`);
            state.ul.parent('componentsNav');
        }
    });

    return Object.assign(
        state,
        displayBarBehaviors(state),
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
        
                state.buttons[i].li.parent(`${state.title}navbar-component`);
                
        
                // CREATES A NEW COMPONENT
        
                state.buttons[i].img.mouseClicked(() => {
                    
                    let newcomp;
        
                    // CREATES NEW COMPUTER
        
                    if (state.buttons[i].componentType == "pc") {
                        newcomp = Computer();
                    }
                    else if (state.buttons[i].componentType == "switch") {
                        newcomp = Switch();
                    }
                    else if (state.buttons[i].componentType == "router") {
                        newcomp = Router();
                    }
        
                    // ADDS IT TO ARRAY OF ALL COMPUTERS
        
                    allComponents.push(newcomp);
                });
            }
        },
        display() {
            state.ul.addClass('navbar-nav mr-auto');
            state.ul.id(`${state.title}navbar-component`);
            state.ul.parent('componentsNav');
        }
    });

    return Object.assign(
        state,
        displayBarBehaviors(state),
    );
}