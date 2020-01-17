let xml;
let json;

var allTabs = allComponentBarTabs.getInstance();
var allCons = allConnections.getInstance();

var allComps = allComponents.getInstance();
var allVRules = allValidationRules.getInstance();


var guiParams;

let compBar;
let compConnectionBar;
let button1, button2, button3, button4;

let gui;

var canvasSideBar;

var canvasLoadProject;
var canvasSaveProject;
var canvasDeleteButton;

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
        };

        // Checking if anything exists on canvas
        if (!allComps.isEmpty()) {
            // looping through all connections
            allCons.get().forEach((c) => {
                var newcon = Connection();
                newcon.setType(c.getType());
                newcon.setMousePos(c.getMousePos()[0], c.getMousePos()[1]);
                newcon.addComponent(c.getComponents()[0].prepareForJson());
                newcon.addComponent(c.getComponents()[1].prepareForJson());
                json.connections.push(newcon.getJSON());
            });

            // looping through all components to get any that haven't got a connection
            allComps.get().forEach((c) => {
                if (!c.getHasConnection()) {
                    json.components.push(c.prepareForJson());
                }
            });
            // Saves json to file
            //console.log(json);
            saveJSON(json, 'network_design_project.json');
        }else {
            alert("Canvas is empty");
        }

    });

    // DELETE COMPONENT
    canvasDeleteButton.addEventListener("click", () => {
        allComps.setSelectCompForDelete(true);
    });
};

function preload() {
    compBar = componentsBarTab("Components", 500, 50, compentsBarComponents("Components"));
    compBar.init();

    compBar.setVisableCurrent();
    allTabs.add(compBar);

    compConnectionBar = componentsBarTab("Connections", 500, 50, componentsBarConnections("Connections"));
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
}

function setup() {
    frameRate(60);

    var canvas = createCanvas((windowWidth - 240), windowHeight);
    canvas.parent("canvasDiv");

    canvasSideBar = createDiv();
    canvasSideBar.class("col-md-auto");
    canvasSideBar.id("canvasSideBar");
    canvasSideBar.parent("canvasRow");
    compBar.getBar().displayAllButtons();
}

function draw() {
    clear();

    allCons.drawAllConnections();
    applyGUIValuesToComp();
    allComps.displayAllComponents();
    updateMouseCursor();


    checkForCopyAndPastEvent();
}

function mousePressed() {
    allComps.setComponent(allComps.getCurrentSelectedComponent(mouseX, mouseY));
    if (allComps.getComponent() != null) {

        var multiSelect = checkForMultiSelect();
        if (!allComps.hasClickedSelectedComponent(allComps.getComponent()) && !multiSelect) {
            allComps.clearSelectList();
        }
        if (allComps.isSelectListEmpty()) {
            allComps.addSelectList(allComps.getComponent());
        }
        if (multiSelect) {
            if (!allComps.hasClickedSelectedComponent(allComps.getComponent())) {
                allComps.addSelectList(allComps.getComponent());
            }
        }
        allComps.setSelectedComponent(allComps.getComponent());
    }else {
        allComps.clearSelectList();
    }
    if (allComps.getComponent() != null) {

        applyCompValuesToGUI();


        // Checks if user has pressed the delete component button
        if (allComps.getSelectCompForDelete()) {
            var comp = allComps.getComponent();
            var index = allComps.get().findIndex(c => c === comp);
            var newList = allComps.get().filter((value, i, arr) => {
                return i != index; 
            });
            allComps.set(newList);
            gui.hide();
            allComps.setSelectCompForDelete(false);
        }

        // Checks if users is selecting two components to make a connection
        if (allCons.getDrawConnection()) {
            allCons.selectConnectionForComp(allComps.getComponent());
        }
    }
}

function mouseMoved() {
    allComps.setComponent(allComps.getCurrentSelectedComponent(mouseX, mouseY));
    if (allComps.getComponent() != null) {
        allComps.setComponentHover(true);
    }else {
        allComps.setComponentHover(false);
    }
    
    if (allCons.getDrawConnection()) {
        allCons.drawConnetions(mouseX, mouseY);
    }
}

function mouseDragged(event) {
    //console.log(event.movementX);
    //console.log(event.movementY);
    if (allComps.getSelectList().length > 1) {
        console.log("multi move");
        allComps.getSelectList().forEach((c) => {
            c.multiMove(event.movementX, event.movementY);
        });
        allComps.setComponentDrag(true);
    }
    else if (allComps.getComponent() != null) {
        console.log("default move");
        allComps.getComponent().move(mouseX, mouseY);
        allComps.setComponentDrag(true);
    }
    if (allComps.getDraggingNewComponent()) {
        allComps.getNewlyCreatedComp().move(mouseX, mouseY);
        allComps.setComponentDrag(true);
    }
}

function mouseReleased() {
    if (allComps.getSelectedComponent()) {
        allComps.getSelectedComponent().setIsClicked(false);
    }
    allComps.setDraggingNewComponent(false);
    allComps.setNewlyCreatedComp(null);
    allComps.setComponentDrag(false);
}

function applyGUIValuesToComp() {
    if (gui != null) {
        // Compares the values of the two objects
        // console.log(JSON.stringify(allComps.getSelectedComponent().getGuiParams()));
        // console.log(JSON.stringify(guiParams));
        if (JSON.stringify(allComps.getSelectedComponent().getGuiParams()) != JSON.stringify(guiParams)) {
            console.log("applying gui params");
            if (guiParams) {
                if (guiParams.HideComponent) {
                    allComps.getSelectedComponent().setHideComponent(true);
                } else {
                    allComps.getSelectedComponent().setHideComponent(false);
                }
                allComps.getSelectedComponent().setComponentName(guiParams.Name);
                allComps.getSelectedComponent().reSize(guiParams.Width);
                allComps.getSelectedComponent().setTextSize(guiParams.TextSize);
                allComps.getSelectedComponent().setHideConnections(guiParams.HideConnections);
            }
        }
    }
}

function applyCompValuesToGUI() {
    if (gui == null) {
        gui = createGui(allComps.getSelectedComponent().getComponentName()).setPosition(1200,400);
        guiParams = {
            'Name': allComps.getSelectedComponent().getComponentName(),
            'Width': allComps.getSelectedComponent().getWidth(),
            'WidthMin': 65,
            'WidthMax': 200,
            'TextSize': allComps.getSelectedComponent().getTextSize(),
            'TextSizeMax': 32,
            'HideComponent': allComps.getSelectedComponent().getHideComponent(),
            'HideConnections': allComps.getSelectedComponent().getHideConnections(),
            'Lock': false,
            'Connections': allCons.getConnectionsRelatedToComp(allComps.getSelectedComponent()),
            
        };
        gui.addObject(guiParams);
    } else {
        gui.setValue('Name', allComps.getSelectedComponent().getComponentName());
        gui.setValue('Width', allComps.getSelectedComponent().getWidth());
        gui.setValue('HideComponent', allComps.getSelectedComponent().getHideComponent());
        gui.setValue('TextSize', allComps.getSelectedComponent().getTextSize());
        gui.setValue('HideConnections', allComps.getSelectedComponent().getHideConnections());
        gui.setValue('Connections',  allCons.getConnectionsRelatedToComp(allComps.getSelectedComponent()));
    }
    gui.setTitle(allComps.getSelectedComponent().getComponentName());
    gui.show();
}

function updateMouseCursor() {
    if (allComps.getComponentDrag()) {
        document.body.style.cursor = "grabbing";
    }
    else if (allCons.getDrawConnection() || allComps.getSelectCompForDelete()) {
        document.body.style.cursor = "crosshair";
    }
    else if (allComps.getComponentHover()) {
        document.body.style.cursor = "grab";
    }
    else {
        document.body.style.cursor = "default"; 
    }
}

function loadComponents(array) {
    
    console.log("loading components");
    console.log(array);

    // LOADING COMPONENTS WITHOUT A CONNECTION
    array.components.forEach((c) => {
        loadImage(c.imgPath, img => {
            var newcomp = createNewComponent(img, c);
            allComps.add(newcomp);
        });
    });

    // LOADING CONNECTIONS
    array.connections.forEach((con) => {
        // new connection
        var newconnection = Connection();
        newconnection.setType(con.type);
        newconnection.setMousePos(con.mousePos[0], con.mousePos[1]);
        
        // looping through all the components in the connection
        con.components.forEach((c) => {
            
            loadImage(c.imgPath, img => {
                var newcomp = createNewComponent(img, c);
                
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
            });
        });
        allCons.add(newconnection);
    });


}
var pasted;
var copied;
var cut;
function checkForCopyAndPastEvent() {
    if (keyIsDown(17) && keyIsDown(67)) {
        // get the selected component
        if (allComps.getSelectedComponent()) {
            alert("Copied Component");
            copied = true;
            pasted = false;
            console.log("copied"); 
        }
    }
    if (keyIsDown(17) && keyIsDown(88)) {
        // get the selected component
        if (allComps.getSelectedComponent()) {
            alert("Cut Component");
            cut = true;
            pasted = false;
            console.log("Component is cut"); 
        }
    }
    if (keyIsDown(17) && keyIsDown(86) && pasted == false) {
        if (allComps.getSelectedComponent()) {
            if (copied) {
                var clonedComponent = clone(allComps.getSelectedComponent());
                clonedComponent.setXpos(mouseX);
                clonedComponent.setYpos(mouseY);
                allComps.add(clonedComponent);
                copied = false;
            }
            else if (cut) {
                var comp = allComps.getSelectedComponent();
                comp.setXpos(mouseX);
                comp.setYpos(mouseY);
                cut = false;
            }
            pasted = true;
            console.log("paste"); 
        }
    }
}
function checkForMultiSelect() {
    if (keyIsDown(17)) {
        return true;
    }else {
        return false;
    }
}

function clone(obj) {
    var newcomp = Component();
    newcomp.setXpos(obj.getXpos());
    newcomp.setYpos(obj.getYpos());
    newcomp.setImage(obj.getImage());
    newcomp.setType(obj.getType());
    newcomp.setWidth(obj.getWidth());
    newcomp.setHeight(obj.getHeight());
    newcomp.setHideComponent(obj.getHideComponent());
    newcomp.setHideConnections(obj.getHideConnections());
    newcomp.setComponentName(obj.getComponentName());
    newcomp.setTextSize(obj.getTextSize());
    return newcomp;
}

function createNewComponent(img, c) {
    
    var newcomp = Component(c.type, c.imgPath, img).init();
    newcomp.setID(c.id);
    newcomp.setXpos(c.Xpos);
    newcomp.setYpos(c.Ypos);
    newcomp.setWidth(c.width);
    newcomp.setHeight(c.height);
    newcomp.setHideComponent(c.hideComponent);
    newcomp.setHideConnections(c.hideConnections);
    newcomp.setComponentName(c.componentName);
    newcomp.setType(c.type);
    newcomp.setTextSize(c.textSize);
    
    return newcomp;
}


// dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas((windowWidth - 240), windowHeight);
}

