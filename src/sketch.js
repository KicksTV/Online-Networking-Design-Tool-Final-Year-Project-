// // Controllers
// import componentController from './javascript/modules/controller/componentController.js';
// import connectionController from './javascript/modules/controller/connectionController.js';
// import networkController from './javascript/modules/controller/networkController.js';
// import panelController from './javascript/modules/controller/panelController.js';
// import saveLoadController from './javascript/modules/controller/saveLoadController.js';

// // Collections
// import allVRules from './javascript/modules/collections/allValidationRules.js';
// import allPanels from './javascript/modules/collections/allPanels.js';

// // Models
// import {componentsBarTab, ComponentBarComponents, ComponentBarConnections} from '../src/javascript/modules/models/componentsBar.js';
// import Button from './javascript/modules/models/button.js';
// import validationRule from './javascript/modules/models/validationRule.js';
// import Graph from './javascript/modules/models/graph.js';

var p5 = require('p5')
var datGUI = require('dat.gui').GUI
var $ = require('jquery')
let io = require('socket.io-client')

var componentController = require('./javascript/modules/controller/componentController.js').default
var saveLoadController = require('./javascript/modules/controller/saveLoadController.js').default
import {componentsBarTab, ComponentBarComponents, ComponentBarConnections} from '../src/javascript/modules/models/componentsBar.js';
var allTabs = require('./javascript/modules/collections/allComponentBarTabs.js').default
var validationRule = require('./javascript/modules/models/validationRule.js').default
var allVRules = require('./javascript/modules/collections/allValidationRules.js').default
var networkController = require('./javascript/modules/controller/networkController.js').default
var panelController = require('./javascript/modules/controller/panelController.js').default
var connectionController = require('./javascript/modules/controller/connectionController.js').default
var Button = require('./javascript/modules/models/button.js').default

var compContrInstance = componentController.getInstance();

// dat.GUI
var gui = null;

let socket;


// Panels or Bars
let compBar;
let compConnectionBar;
let button1, button2, button3, button4, button5, 
    button6, button7, button8, button9, button10, 
    button11, button12;

// Canvas Buttons
var canvas;
var canvasLoadProject;
var canvasSaveProject;
var canvasDeleteButton;

//EVENTS
var componentCslickEvent = new CustomEvent('componentClickEvent');

window.onload = function() {

    canvasDeleteButton = document.getElementById("canvasDeleteButton");
    canvasLoadProject = document.getElementById("canvasLoadProject");
    canvasSaveProject = document.getElementById("canvasSaveProject");


    // LOAD
    var input = document.getElementById("upload_input");
    canvasLoadProject.addEventListener("click", () => {
        input.click();
    });
    input.onchange = saveLoadController.getInstance().loadEvent;

    // SAVE
    canvasSaveProject.addEventListener("click", saveLoadController.getInstance().saveEvent);

    // DELETE COMPONENT
    canvasDeleteButton.addEventListener("click", () => {
        compContrInstance.setSelectCompForDelete(true);
    });

    compBar = componentsBarTab("Components", 500, 50, new ComponentBarComponents("Components"));
        compBar.init();
    
        allTabs.getInstance().setVisableCurrent(compBar);
        allTabs.getInstance().add(compBar);
    
        compConnectionBar = componentsBarTab("Connections", 500, 50, new ComponentBarConnections("Connections"));
        compConnectionBar.init();
        allTabs.getInstance().add(compConnectionBar);
};
new p5(function(p5) {
    p5.preload = function() {

        


        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
          }
        };
        xhttp.open("GET", "/components/cloud.xml", true);
        xhttp.send();


        var folder = "/components";


        $.ajax({
            url : folder,
            success: function (data) {
                var some = $(data).find("a").attr("href", function (i, val) {
                    
                    if( val.match(/\.(xml)$/) ) { 
                        let xml = loadXML(val, () => {
                            //print("done");

                            let name = xml.getChild('name').getContent();
                            let type = xml.getChild('type').getContent();
                            let imgPath = xml.getChild('image').getString('path');
                            let imgAlt = xml.getChild('image').getString('alt');

                            // print(name, type, imgPath, imgAlt);


                            var btn = Button(name, type, imgPath, imgAlt).init();

                            if (type == "Device") {
                                compBar.getBar().add(btn);
                            }
                            else if (type == "Cable") {
                                compConnectionBar.getBar().add(btn);
                            }
                            if (i == some.length-1) {
                                compBar.getBar().displayAllButtons();
                            }
                        });
                    } 
                });
            }
        });

        var btn = Button("PC", "Device", "/images/pc.svg", "Personal Desktop").init();

        compBar.getBar().add(btn);

        compBar.getBar().displayAllButtons();

        var validationRules1 = validationRule("Server","Smartphone", false, "Connection is not allowed!");
        var validationRules2 = validationRule("Access Point","Cloud", false, "Connection is not allowed!");
        var validationRules3 = validationRule("Smartphone","Switch", false, "Connection is not allowed!");
        var validationRules4 = validationRule("Laptop","Smartphone", false, "Connection is not allowed!");
        var validationRules5 = validationRule("Access Point","Laptop", false, "Connection is not allowed!");
        var validationRules6 = validationRule("Access Point","Printer", false, "Connection is not allowed!");
    
        allVRules.getInstance().add(validationRules1);
        allVRules.getInstance().add(validationRules2);
        allVRules.getInstance().add(validationRules3);
        allVRules.getInstance().add(validationRules4);
        allVRules.getInstance().add(validationRules5);
        allVRules.getInstance().add(validationRules6);
    
    
        gui = new datGUI({ autoPlace: false });
        var con = document.getElementById("rightSidePanel");
        con.appendChild(gui.domElement);
        gui.width = 400;

        // print(gui)

        networkController.getInstance().initGUI(gui);
        compContrInstance.initGUI(gui);
    
        networkController.getInstance().initNetworkListener(gui);
    
        panelController.getInstance();
    }
    p5.setup = function() {
        frameRate(60);

        canvas = p5.createCanvas((windowWidth-20), windowHeight);
        canvas.parent("canvasDiv");
        socket = io.connect();


        // We make a named event called 'mouse' and write an
        // anonymous callback function
        socket.on('mouse',
            function(data) {
                // Draw a blue circle
                fill(0,0,255);
                noStroke();
                ellipse(data.x,data.y,80,80);
            }
        );

    }
    p5.draw = function() {
        clear();
        connectionController.getInstance().drawAllConnections();
        componentController.getInstance().displayAllComponents();
        //updateMouseCursor();

        checkForCopyAndPastEvent();
        checkComponentDeleteEvent();
    }
    p5.mousePressed = function() {
        let multiSelect = compContrInstance.checkForMultiSelect();
        compContrInstance.checkForSelectedComponent(mouseX, mouseY);
    
        if (compContrInstance.isCurrentlyClickingComp() != null) {
            if (!compContrInstance.hasClickedSelectedComponent() && !multiSelect) {
                print("clear select list");
                compContrInstance.clearSelectList();
            }
            
            if (multiSelect) {
                if (!compContrInstance.hasClickedSelectedComponent()) {
                    if (compContrInstance.isSelectListEmpty()) {
                        compContrInstance.initMultiSelectList();
                    } else {
                        compContrInstance.addSelectList(compContrInstance.isCurrentlyClickingComp());
                    }
                }
            }
    
            // NEED TO CHANGE HOW THIS WORKS - PREVENTS INTERACTION WITH CANVAS WHILE SELECTING INTERFACE
            //print(connectionController.getInstance().isSelectingInterfacePort());
            if (! connectionController.getInstance().isSelectingInterfacePort()) {
                compContrInstance.setSelectedComponent(compContrInstance.getSelectedComponent());
    
                // apply seleceted comp values to gui
                compContrInstance.applyGUIValues();
    
                panelController.getInstance().updatePanelWithData(compContrInstance.getSelectedComponent());
                
                checkComponentDeleteEvent();
    
                // Checks if users is selecting two components to make a connection
                if (connectionController.getInstance().getDrawConnection()) {
                    connectionController.getInstance().selectConnectionForComp(compContrInstance.getSelectedComponent());
                }
            }
    
    
        }else {
            // checking if the user is clicking the bin icon, if so then dont clear select list.
            if (mouseX > 104 && mouseY > 39) {
                if (!compContrInstance.hasClickedSelectedComponent() && !multiSelect) {
                    print("clear select list");
                    compContrInstance.clearSelectList();
                }
                if (!compContrInstance.hasCopiedComponent()) {
                    compContrInstance.clearSelectList();
                }
            }
        }
    }
    p5.mouseMoved = function() {
        if (compContrInstance.isCurrentlyClickingComp() != null) {
            compContrInstance.setComponentHover(true);
        }else {
            compContrInstance.setComponentHover(false);
        }
        
        if (connectionController.getInstance().getDrawConnection()) {
            connectionController.getInstance().drawConnetions(mouseX, mouseY);
        }
    }
    p5.mouseDragged = function(event) {
        //console.log(event.movementX);
        //console.log(event.movementY);
        if (compContrInstance.getSelectList().length > 1) {
            // console.log("multi move");
            compContrInstance.getSelectList().forEach((c) => {
                c.multiMove(event.movementX, event.movementY);
            });
            compContrInstance.setComponentDrag(true);
        }
        else if (compContrInstance.isCurrentlyClickingComp() != null) {
            // console.log("default move");

            let data = {
                x: mouseX,
                y: mouseY
            };
            // Send that object to the socket
            socket.emit('mouse', data);
            
            compContrInstance.getSelectedComponent().move(mouseX, mouseY);
            
            compContrInstance.setComponentDrag(true);
        }
        if (compContrInstance.getDraggingNewComponent()) {

            // Catching expected error when dragging component before it has been created
            try {
                compContrInstance.getNewlyCreatedComp().move(mouseX, mouseY);
            } catch (error) {
                // console.error(error);
                // expected output: ReferenceError: nonExistentFunction is not defined
                // Note - error messages will vary depending on browser
            }
            compContrInstance.setComponentDrag(true);
        }
    }
    p5.mouseReleased = function() {
        if (compContrInstance.isCurrentlyClickingComp()) {
            compContrInstance.getSelectedComponent().setIsClicked(false);
        }
        compContrInstance.setDraggingNewComponent(false);
        compContrInstance.setNewlyCreatedComp(null);
        compContrInstance.setComponentDrag(false);
    }

    
    
    // dynamically adjust the canvas to the window
    p5.windowResized = function() {
        print("resize window");
        p5.resizeCanvas((windowWidth-20), windowHeight);
    }
});

// function updateMouseCursor() {
//     if (compContrInstance.getComponentDrag()) {
//         document.body.style.cursor = "grabbing";
//     }
//     else if (connectionController.getInstance().getDrawConnection() || compContrInstance.getSelectCompForDelete()) {
//         document.body.style.cursor = "crosshair";
//     }
//     else if (compContrInstance.getComponentHover()) {
//         document.body.style.cursor = "grab";
//     }
//     else {
//         document.body.style.cursor = "default"; 
//     }
// }
function checkForCopyAndPastEvent() {

    // COPY
    if (keyIsDown(17) && keyIsDown(67)) {
        compContrInstance.copySelectedComponents()

        $('#copyToastAlert').toast('show');
        $('#copyToastAlert .toast-body').text(
            "Successfully copied."
        );
    }
    // CUT 
    if (keyIsDown(17) && keyIsDown(88)) {
        compContrInstance.cutSelectedComponents()

        $('#cutToastAlert').toast('show');
        $('#cutToastAlert .toast-body').text(
            "Successfully cut."
        );
    }
    // PASTE
    if (keyIsDown(17) && keyIsDown(86) && compContrInstance.hasPastedComponent() == false) {
        compContrInstance.pasteSelectedComponents()

        $('#pasteToastAlert').toast('show');
        $('#pasteToastAlert .toast-body').text(
            "Successfully pasted."
        );

        // Triggering networkChangeEvent
        networkController.getInstance().dispatchNetworkChangeEvent();
    }
}

function checkComponentDeleteEvent() {
    // Checks if user has pressed the delete canvas button

    if (compContrInstance.getSelectCompForDelete()) {
        
        print("IsSelectListEmpty: " + compContrInstance.isSelectListEmpty());

        print("List: " + compContrInstance.getSelectList());

        if (! compContrInstance.isSelectListEmpty()) {
            console.log("multi select delete");
            var list = compContrInstance.getSelectList();

            list.forEach((comp) => {
                compContrInstance.removeComponent(comp);
                // Delete related connections
                connectionController.getInstance().deleteConnection(comp);
            });
            gui.removeFolder(compContrInstance.getPropertiesPanel());
        } 
        else if (compContrInstance.getSelectedComponent() != null) {
            var comp = compContrInstance.getSelectedComponent();
            compContrInstance.removeComponent(comp);
            // Delete related connections
            connectionController.getInstance().deleteConnection(comp);

            $('#deleteToastAlert').toast('show');
            $('#deleteToastAlert .toast-body').text(
                compContrInstance.getSelectedComponent().displayName + " has been deleted."
            );

            gui.removeFolder(compContrInstance.getPropertiesPanel());

        }
        Graph.getInstance().updateGraph();

        // Triggering networkChangeEvent
        networkController.getInstance().dispatchNetworkChangeEvent();

        compContrInstance.setSelectCompForDelete(false);
    }
}



