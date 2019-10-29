let xml;
let json;

var allTabs = allComponentBarTabs.getInstance();
var allCons = allConnections.getInstance();

var allComponents = [];
var getComponent;
var selectedComponent;
var preComputer;

var guiParams;

let compBar;
let compConnectionBar


let button1, button2, button3, button4;

let gui;

var canvasSideBar;

function preload() {
    compBar = componentsBarTab("Components", 500, 50, compentsBarComponents("Components"));
    compBar.init();

    compBar.setVisableCurrent();
    allTabs.add(compBar);

    compConnectionBar = componentsBarTab("Connections", 500, 50, componentsBarConnections("Connections"));
    compConnectionBar.init();
    allTabs.add(compConnectionBar);




    // Creating button icons for TABS
    button1 = Button('img/router.svg', 'component image', "Router").init();
    button2 = Button('img/switch.svg', 'component image', "Switch").init();
    button3 = Button('img/pc.svg', 'component image', "PC").init();
    button4 = Button('img/printer.svg', 'component image', "Printer").init();
    button5 = Button('img/laptop.svg', 'component image', "Laptop").init();
    button6 = Button('img/smartphone.svg', 'component image', "Smartphone").init();
    button7 = Button('img/server.svg', 'component image', "Server").init();
    button8 = Button('img/cloud.svg', 'component image', "Cloud").init();

    button9 = Button('img/tp-cable.svg', 'Connection Image', 'Twisted Pair').init();
    button10 = Button('img/coaxial-cable.svg', 'Connection Image', 'Coaxial').init();
    button11 = Button('img/fibre-cable.svg', 'Connection Image', 'Fibre').init();
    
    // Adding created buttons to TABS
    compBar.getBar().add(button1);
    compBar.getBar().add(button2);
    compBar.getBar().add(button3);
    compBar.getBar().add(button4);
    compBar.getBar().add(button5);
    compBar.getBar().add(button6);
    compBar.getBar().add(button7);
    compBar.getBar().add(button8);
    compConnectionBar.getBar().add(button9);
    compConnectionBar.getBar().add(button10);
    compConnectionBar.getBar().add(button11);

}

function setup() {
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

    drawAllConnections();
    applyGUIValuesToComp();
    displayAllComponents();
}

function mousePressed() {
    getComponent = getCurrentSelectedComponent(mouseX, mouseY);
    if (getComponent != null) {
        selectedComponent = getComponent;
    }
    if (getComponent != null) {
        
        if (allCons.getDrawConnection()) {
            allCons.selectConnectionForComp(getComponent);
        }
        applyCompValuesToGUI();
    }
}

function mouseMoved() {
    if (allCons.getDrawConnection()) {
        allCons.drawConnetions(mouseX, mouseY);
    }
}

function mouseDragged() {
    if (getComponent != null) {
        getComponent.move(mouseX, mouseY);
    }
}

function mouseRelease() {
    selectedComponent.getIsClicked() = false;
}

function getCurrentSelectedComponent(mouseX, mouseY) {
    for (var i=0; i<allComponents.length;i++) {
        var clicked = allComponents[i].clicked(mouseX, mouseY);
        if (clicked) {
            return allComponents[i];
        }
    }
    return null;
}

function displayAllComponents() {
    if (allComponents.length > 0) {
        for (var i=0; i<allComponents.length;i++) {
            // Checks if undefined
            if (typeof allComponents[i] !== 'undefined') {
                // Check if hideComponent is true or false
                if (!allComponents[i].getHideComponent()) {
                    allComponents[i].display();
                }
            }else {
                console.log("comp undefined");
            }
        }
    }
}

function drawAllConnections() {
    if (allCons.getSelectingSecondConnection()) {
        allCons.get().forEach((i) => {
            i.compSelectDisplay();
        });
    }else {
        allCons.get().forEach((i) => {
            
            // Prevents displaying incomplete set connections
            if (i != allCons.getSelectedConnection()) {
                
                // Checks if linking component wishs to hide its connection
                if (!(i.isHidden())) {
                    i.defaultDisplay();
                }
            }
        });
    }
}

function applyGUIValuesToComp() {
    if (gui != null) {
        // Compares the values of the two objects
        if (JSON.stringify(selectedComponent.getGuiParams()) != JSON.stringify(guiParams)) {
            console.log("applying gui params");
            if (guiParams) {
                if (guiParams.HideComponent) {
                    selectedComponent.setHideComponent(true);
                } else {
                    selectedComponent.setHideComponent(false);
                }
                selectedComponent.setComponentName(guiParams.Name);
                var w = selectedComponent.getWidth() + (guiParams.Width - selectedComponent.getWidth());
                var h = selectedComponent.getHeight() + (guiParams.Width - selectedComponent.getWidth());
                selectedComponent.setWidth(w);
                if (h > 20){
                    selectedComponent.setHeight(h);
                }
                selectedComponent.setTextSize(guiParams.TextSize);
                selectedComponent.setHideConnections(guiParams.HideConnections);
            }
        }
    }
}

function applyCompValuesToGUI() {
    if (gui == null) {
        gui = createGui(selectedComponent.componentName).setPosition(220,220);
        guiParams = {
            'Name': selectedComponent.getComponentName(),
            'Width': selectedComponent.getWidth(),
            'TextSize': selectedComponent.getTextSize(),
            'TextSizeMax': 32,
            'WidthMin': selectedComponent.getWidthMin(),
            'WidthMax': selectedComponent.getWidthMax(),
            'HideComponent': selectedComponent.getHideComponent(),
            'HideConnections': selectedComponent.getHideConnections(),
        };
        gui.addObject(guiParams);
    } else {
        gui.setValue('Name', selectedComponent.getComponentName());
        gui.setValue('Width', selectedComponent.getWidth());
        gui.setValue('HideComponent', selectedComponent.getHideComponent());
        gui.setValue('TextSize', selectedComponent.getTextSize());
        gui.setValue('HideConnections', selectedComponent.getHideConnections());
    }
    console.log("applying comp values to gui");
    gui.setTitle(selectedComponent.getComponentName());
}




// dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

