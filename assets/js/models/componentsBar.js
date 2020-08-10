
// Controllers
import connectionController from '../controller/connectionController.js';
import componentController from '../controller/componentController.js';
import ioController from '../controller/ioController.js';
import networkController from '../controller/networkController.js';

// Collections
import allComponents from '../collections/allComponents.js';
import allConnections from '../collections/allConnections.js';
import allTabs from '../collections/allComponentBarTabs.js';

// Mixin
import {compBarGetSetMixin} from '../mixin/mixin.js';

// Models
import Graph from './graph.js';

var p5 = require('p5')

class ComponentsBarItem {
    constructor(title) {
        this.title = title;
        this.buttons = [];
        this.ul = new p5().createElement('ul', '');
    }
}

export function componentsBarTab (title, width, height, bar) {
    let state = {
        title,
        width,
        height,

        bar,
        // CREATING NEW HTML ELEMENTS
        
        "li": new p5().createElement('li', ''),
        "a": new p5().createElement('a', title),
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
            allTabs.getInstance().hideCurrentButtons();
            allTabs.getInstance().unsetVisableCurrent();
            state.bar.displayAllButtons();
            allTabs.getInstance().setVisableCurrent(state);
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

export class ComponentBarComponents extends compBarGetSetMixin(ComponentsBarItem) {

    displayAllButtons() {

        this.ul.show();

        // LOOPS THROUGH ALL BUTTONS AND DISPLAY's EACH ONE
        
        for (let i=0; i < this.buttons.length; i++) {
    
            this.buttons[i].display();
    
            // ADDS BUTTON ELEMENT TO NAVBAR

            this.buttons[i].getLI().parent(`${this.title}navbar-component`);
            
    
            // CREATES A NEW COMPONENT WHEN COMPONENT BUTTON IS CLICKED
            this.buttons[i].getIMG().mousePressed(async () => {
    
                componentController.getInstance().setDraggingNewComponent(true);

                // CREATES NEW COMPONENT
                var name = this.buttons[i].getName();
                let defaultComponent = await componentController.getInstance().createNewComponent(name);


                ioController.getInstance().sendData('createComponent', defaultComponent.prepareForJson());

                // ADDS IT TO ARRAY OF ALL components
                allComponents.getInstance().add(defaultComponent);

                // Adds component to graph
                Graph.getInstance().addNode(defaultComponent.id);

                networkController.getInstance().dispatchNetworkChangeEvent()
            });
        }
    }
}


export class ComponentBarConnections extends compBarGetSetMixin(ComponentsBarItem) {

    displayAllButtons() {

        this.ul.show();

        // LOOPS THROUGH ALL BUTTONS AND DISPLAY's EACH ONE
        
        for (let i=0; i < this.buttons.length; i++) {
    
            this.buttons[i].display();
    
            // ADDS BUTTON ELEMENT TO NAVBAR
    
            this.buttons[i].getLI().parent(`${this.title}navbar-component`);
            
    
            // CREATES A NEW COMPONENT
    
            this.buttons[i].getIMG().mouseClicked(async () => {
                let name = this.buttons[i].getName();
                let c = await connectionController.getInstance().createNewConnection(name);
                connectionController.getInstance().setDrawConnection(true);
                allConnections.getInstance().setSelectedConnection(c);

                
                $('#startConnectionToastAlert').toast('show');
                $('#startConnectionToastAlert .toast-body').text(
                    "Please select two commonents!"
                );
                
            });
        }
    }
    
}