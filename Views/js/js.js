let xml;
let json;

let canvas;

var allTabs = allComponentBarTabs.getInstance();

var allComponents = [];
var getComputer;
var selectedComputer;
var preComputer;

var guiParams;

let compBar;
let compConnectionBar


let button1, button2, button3;

let gui;

function preload() {
    compBar = componentsBarTab("Components", 500, 50, compentsBarComponents("Components"));
    compBar.init();

    compBar.setVisableCurrent();
    allTabs.add(compBar);

    compConnectionBar = componentsBarTab("Connections", 500, 50, componentsBarConnections("Connections"));
    compConnectionBar.init();
    allTabs.add(compConnectionBar);




    // Creating button icons for TABS
    button1 = Button('img/router.svg', 'component image', "router");
    button2 = Button('img/switch.svg', 'component image', "switch");
    button3 = Button('img/pc.svg', 'component image', "pc");
    
    // Adding created buttons to TABS
    compBar.getBar().add(button1);
    compBar.getBar().add(button2);
    compBar.getBar().add(button3);
    compConnectionBar.getBar().add(button3);
    compConnectionBar.getBar().add(button2);
    compConnectionBar.getBar().add(button1);

}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    compBar.getBar().displayAllButtons();
}
function draw() {
    clear();

    applyGUIValues();

    displayAllComponents();

    allTabs.drawConnection();
}

function mousePressed() {
    getComputer = getCurrentSelectedComponent(mouseX, mouseY);
    if (getComputer != null) {
        selectedComputer = getComputer;
    }
    if (getComputer != null) {
        if (gui == null) {
            gui = createGui(selectedComputer.componentName).setPosition(220,220);
            guiParams = {
                'width': selectedComputer.width,
                'textSize': selectedComputer.textSize,
                'textSizeMax': 32,
                'widthMin': selectedComputer.widthMin,
                'widthMax': selectedComputer.widthMax,
                'hideComponent': selectedComputer.hideComponent
            };
            gui.addObject(guiParams);
        } else {
            gui.setTitle(selectedComputer.componentName);

            gui.setValue('width', selectedComputer.width);
            gui.setValue('hideComponent', selectedComputer.hideComponent);
            gui.setValue('textSize', selectedComputer.textSize);

        }
    }
}


// function mouseClicked() {
//     allTabs.setFirstDrawConnection();
// }

var xdraw2, ydraw2; 

function mouseMoved() {
    allTabs.setSecondDrawConnection();
}

function mouseDragged() {
    if (getComputer != null) {
        getComputer.move(mouseX, mouseY);
    }
}

function mouseRelease() {
    selectedComputer.isClicked = false;
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
                
            // Check if hideComponent is true or false
            if (!allComponents[i].hideComponent) {
                allComponents[i].display();
            }
        }
    }
}

function applyGUIValues() {
    if (guiParams) {
        if (guiParams.hideComponent) {
            selectedComputer.hideComponent = true;
        } else {
            selectedComputer.hideComponent = false;
        }
        selectedComputer.width = guiParams.width;
        selectedComputer.height = selectedComputer.width / 1.2;
        selectedComputer.textSize = guiParams.textSize;
    }
}



// dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

