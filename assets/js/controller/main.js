// Collections
var allTabs = allComponentBarTabs.getInstance();
var allComps = allComponents.getInstance();
var allVRules = allValidationRules.getInstance();
var allPanels = allPanels.getInstance();

// Controllers
var compContrInstance = componentController.getInstance();

// dat.GUI
var gui = null;

// Panels or Bars
let bottomPanel;
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
var networkChangeEvent = new CustomEvent('networkChangeEvent');
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
    input.onchange = function (evt) {
        var result = evt.target;
        if ('files' in result) {
            if (result.files.length == 0) {
                // user didnt select file
            }else {
                var files = result.files;
                // loops all selected files or file
                for (var i=0, f;f = files[i]; i++) {
                    var reader = new FileReader();

                    // Only process json files.
                    if (!f.type.match('json.*')) {
                        alert("Not JSON File!");
                        continue;
                    }

                    // Closure to capture the file information.
                    reader.onload = (function(theFile) {
                        return function(e) {
                            console.log("running loadJSON");
                            loadJSON(e.target.result, loadComponents);
                        };
                    })(f);

                    reader.onerror = (evt) => {
                        if(evt.target.error.name == "NotReadableError") {
                            // The file could not be read
                            console.log("file could not be read");
                        }
                    }
                    reader.readAsDataURL(f);
                }
            }
        }
    }

    // SAVE
    canvasSaveProject.addEventListener("click", () => {
        // Setup of json format
        var json = {
            "connections": [],
            "components": [],
            "subnets": [],
        };
        // Checking if anything exists on canvas
        if (!allComps.isEmpty()) {
            // looping through all connections
            allConnections.getInstance().get().forEach((con) => {
                json.connections.push(con.prepareForJson());
            });
            // looping through all components to get any that haven't got a connection
            allComps.get().forEach((comp) => {
                if (!comp.hasConnection()) {
                    json.components.push(comp.prepareForJson());
                }
            });

            // Saving all subnets
            allSubnets.getInstance().getAll().forEach(s => {
                json.subnets.push(s);
            });

            // Saves json to file
            console.log(json);
            saveJSON(json, 'network_design_project.json');
        }else {
            alert("Canvas is empty");
        }

    });

    // DELETE COMPONENT
    canvasDeleteButton.addEventListener("click", () => {
        compContrInstance.setSelectCompForDelete(true);
    });
};
function preload() {

    compBar = componentsBarTab("Components", 500, 50, new ComponentBarComponents("Components"));
    compBar.init();

    allTabs.setVisableCurrent(compBar);
    allTabs.add(compBar);

    compConnectionBar = componentsBarTab("Connections", 500, 50, new ComponentBarConnections("Connections"));
    compConnectionBar.init();
    allTabs.add(compConnectionBar);


    // Creating button icons for TABS
    button1 = Button('/assets/img/router.svg', 'component image', "Router").init();
    button2 = Button('/assets/img/switch.svg', 'component image', "Switch").init();
    button3 = Button('/assets/img/pc.svg', 'component image', "PC").init();
    button4 = Button('/assets/img/printer.svg', 'component image', "Printer").init();
    button5 = Button('/assets/img/laptop.svg', 'component image', "Laptop").init();
    button6 = Button('/assets/img/smartphone.svg', 'component image', "Smartphone").init();
    button7 = Button('/assets/img/server.svg', 'component image', "Server").init();
    button8 = Button('/assets/img/cloud.svg', 'component image', "Cloud").init();
    button9 = Button('/assets/img/wireless-access-point.svg', 'component image', "Access Point").init();

    button10 = Button('/assets/img/tp-cable.svg', 'Connection Image', 'Twisted Pair').init();
    button11 = Button('/assets/img/coaxial-cable.svg', 'Connection Image', 'Coaxial').init();
    button12 = Button('/assets/img/fibre-cable.svg', 'Connection Image', 'Fibre').init();
    
    // Adding created buttons to TABS
    compBar.getBar().add(button1);
    compBar.getBar().add(button2);
    compBar.getBar().add(button3);
    compBar.getBar().add(button4);
    compBar.getBar().add(button5);
    compBar.getBar().add(button6);
    compBar.getBar().add(button7);
    compBar.getBar().add(button8);
    compBar.getBar().add(button9);
    compConnectionBar.getBar().add(button10);
    compConnectionBar.getBar().add(button11);
    compConnectionBar.getBar().add(button12);

    var validationRules1 = validationRule("Server","Smartphone", false, "Connection is not allowed!");
    var validationRules2 = validationRule("Access Point","Cloud", false, "Connection is not allowed!");
    var validationRules3 = validationRule("Smartphone","Switch", false, "Connection is not allowed!");
    var validationRules4 = validationRule("Laptop","Smartphone", false, "Connection is not allowed!");
    var validationRules5 = validationRule("Access Point","Laptop", false, "Connection is not allowed!");
    var validationRules6 = validationRule("Access Point","Printer", false, "Connection is not allowed!");

    allVRules.add(validationRules1);
    allVRules.add(validationRules2);
    allVRules.add(validationRules3);
    allVRules.add(validationRules4);
    allVRules.add(validationRules5);
    allVRules.add(validationRules6);


    gui = new dat.GUI({ autoPlace: false });
    var con = document.getElementById("rightSidePanel");
    con.appendChild(gui.domElement);
    gui.width = 400;

    networkController.getInstance().initGUI(gui);
    compContrInstance.initGUI(gui);

    gui.domElement.addEventListener('networkChangeEvent', networkController.getInstance().calculateAllNetworkProperties);

    panelController.getInstance();
}
function setup() {
    frameRate(60);

    canvas = createCanvas((windowWidth-20), windowHeight);
    canvas.parent("canvasDiv");

    compBar.getBar().displayAllButtons();

}
function draw() {
    clear();
    connectionController.getInstance().drawAllConnections();
    componentController.getInstance().displayAllComponents();
    updateMouseCursor();

    checkForCopyAndPastEvent();
    checkComponentDeleteEvent();

}
function mousePressed() {
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
        print(connectionController.getInstance().isSelectingInterfacePort());
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

function mouseMoved() {
    
    if (compContrInstance.isCurrentlyClickingComp() != null) {
        compContrInstance.setComponentHover(true);
    }else {
        compContrInstance.setComponentHover(false);
    }
    
    if (connectionController.getInstance().getDrawConnection()) {
        connectionController.getInstance().drawConnetions(mouseX, mouseY);
    }
}

function mouseDragged(event) {
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
        compContrInstance.getSelectedComponent().move(mouseX, mouseY);
        compContrInstance.setComponentDrag(true);
    }
    if (compContrInstance.getDraggingNewComponent()) {
        compContrInstance.getNewlyCreatedComp().move(mouseX, mouseY);
        compContrInstance.setComponentDrag(true);
    }
}

function mouseReleased() {
    if (compContrInstance.isCurrentlyClickingComp()) {
        compContrInstance.getSelectedComponent().setIsClicked(false);
    }
    compContrInstance.setDraggingNewComponent(false);
    compContrInstance.setNewlyCreatedComp(null);
    compContrInstance.setComponentDrag(false);
}
function updateMouseCursor() {
    if (compContrInstance.getComponentDrag()) {
        document.body.style.cursor = "grabbing";
    }
    else if (connectionController.getInstance().getDrawConnection() || compContrInstance.getSelectCompForDelete()) {
        document.body.style.cursor = "crosshair";
    }
    else if (compContrInstance.getComponentHover()) {
        document.body.style.cursor = "grab";
    }
    else {
        document.body.style.cursor = "default"; 
    }
}

// PROJECT LOADING FUNCTION
function loadComponents(array) {

    // LOADING SAVED SUBNETS
    array.subnets.forEach(s => {
        let newSub = new Subnet()
        newSub = cloneObject(s, newSub)
        allSubnets.getInstance().add(newSub);
    });

    //print(allSubnets.getInstance().getAll());
    
    // LOADING COMPONENTS WITHOUT A CONNECTION
    array.components.forEach((comp) => {
        loadImage(comp.imgPath, img => {
            var newcomp = compContrInstance.createNewComponent(comp.type, comp.imgPath, img);
            newcomp = Object.assign(newcomp, comp);

            // Setting size of the component
            newcomp.setWidth(comp.width);
            newcomp.setHeight(comp.height);

            allComps.add(newcomp);
        });
    });
    // LOADING CONNECTIONS
    array.connections.forEach((con) => {
        // new connection
        var newconnection = new Con(con.type);
        newconnection.setID(con.id);
        newconnection.setMousePos(con.mousePos[0], con.mousePos[1]);


        con._interfacePorts.forEach((ip) => {
            var index = con._interfacePorts.indexOf(ip);
            newconnection.addInterfacePort([new Interface(), ip[1]]);
            Object.assign(newconnection.getInterface(index), ip[0]);
        });
        
        // looping through all the components in the connection
        con._components.forEach((comp) => {
            
            loadImage(comp.imgPath, img => {
                var newcomp = compContrInstance.createNewComponent(comp.type, comp.imgPath, img);
                newcomp = Object.assign(newcomp, comp);

                // Setting size of the component
                newcomp.setWidth(comp.width);
                newcomp.setHeight(comp.height);
                
                // comp has a connection
                newcomp.setHasConnection(true);

                // add comps interfaces
                newcomp.injectInterfaceSavedData(newconnection.getInterface(con._components.indexOf(comp)));

                //print(newcomp.getInterface(0));


                // Checks if a component instance already exists.
                var exists = false;
                var existingComp;
                if (allComps.get().length > 0) {
                    allComps.get().forEach((comp) => {
                        if (comp.getID() == newcomp.getID()) {
                            exists = true;
                            existingComp = comp;
                        }
                    });
                }
                if (exists == false) {
                    allComps.add(newcomp);
                }
                if (newconnection) {
                    if (exists == true) {
                        newconnection.addComponent(existingComp);
                    }else {
                        newconnection.addComponent(newcomp);
                    }
                }
                print("Loaded File Components");
            });
            
        });

        allConnections.getInstance().add(newconnection);
        
    });
    window.setTimeout(() => {
        gui.domElement.dispatchEvent(networkChangeEvent)
    }, 500);
}

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
        gui.domElement.dispatchEvent(networkChangeEvent);
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

            list.forEach((c) => {

                compContrInstance.removeComponent(c);


                // get connection
                var connectionsToDel = allConnections.getInstance().getConnectionsRelatedToComp(c);
                connectionsToDel.forEach((con) => {
                allConnections.getInstance().removeConnection(con);
                
                });

            });
            gui.removeFolder(compContrInstance.getPropertiesPanel());
        } 
        else if (compContrInstance.getSelectedComponent() != null) {
            var comp = compContrInstance.getSelectedComponent();

            print(comp);

            compContrInstance.removeComponent(comp);


            // get connection
            var connectionsToDel = allConnections.getInstance().getConnectionsRelatedToComp(comp);
            connectionsToDel.forEach((c) => {
                allConnections.getInstance().removeConnection(c);
            });


            $('#deleteToastAlert').toast('show');
            $('#deleteToastAlert .toast-body').text(
                compContrInstance.getSelectedComponent().getComponentName() + " has been deleted."
            );

            gui.removeFolder(compContrInstance.getPropertiesPanel());



            // Triggering networkChangeEvent
            gui.domElement.dispatchEvent(networkChangeEvent);
        }
        compContrInstance.setSelectCompForDelete(false);
    }
}

function cloneObject(srcObj, targetObj) {
    // goes through all attributes of obj and copies its value
    for (let key in srcObj) {
        targetObj[key] = srcObj[key] 
    }
    return targetObj;
}

// dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas((windowWidth-20), windowHeight);
}

