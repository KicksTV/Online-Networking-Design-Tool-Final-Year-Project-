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
                
        
                // CREATES A NEW COMPONENT WHEN COMPONENT BUTTON IS CLICKED
                state.buttons[i].getIMG().mousePressed(() => {
        
                    allComps.setDraggingNewComponent(true);

                    // CREATES NEW COMPONENT

                    var path = state.buttons[i].getImgPath();
                    var type = state.buttons[i].getComponentType();

                    loadImage(path, img => {
                        img.width = img.width/2;
                        img.height = img.height/2;
                        let newcomp = Component(type, path, img).init();
                        allComps.setNewlyCreatedComp(newcomp);
                        // ADDS IT TO ARRAY OF ALL components

                        allComps.add(newcomp);
                    });
                });


                // CREATES A NEW COMPONENT WHEN COMPONENT BUTTON IS DRAGGED
                // state.buttons[i].getIMG().mouseClicked(() => {

                // });
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
                    alert("Please select two components!");
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