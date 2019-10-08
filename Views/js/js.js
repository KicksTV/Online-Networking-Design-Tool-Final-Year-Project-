let xml;
let json;

let canvas;

var allTabs = allComponentBarTabs.getInstance();

var allComponentBarTabs = [];
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

    compBar.setCurrent();
    allTabs.add(compBar);

    compConnectionBar = componentsBarTab("Connections", 500, 50, componentsBarConnections("Connections"));
    compConnectionBar.init();
    allTabs.add(compConnectionBar);





    button1 = Button('img/router.svg', 'component image', "router");
    button2 = Button('img/switch.svg', 'component image', "switch");
    button3 = Button('img/pc.svg', 'component image', "pc");
    compBar.getBar().buttons.push(button1);
    compBar.getBar().buttons.push(button2);
    compBar.getBar().buttons.push(button3);

    compConnectionBar.getBar().buttons.push(button3);
    compConnectionBar.getBar().buttons.push(button2);
    compConnectionBar.getBar().buttons.push(button1);

}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    compBar.display();
    compBar.getBar().displayAllButtons();

    compConnectionBar.display();

}
function draw() {
    clear();

    applyGUIValues();

    displayAllComponents();

    allTabs.drawConnection();
}

function mousePressed() {
    // if (selectedComputer != null) {
    //     preComputer = selectedComputer;
    // }
    getComputer = getCurrentSelectedComputer(mouseX, mouseY);
    if (getComputer != null) {
        selectedComputer = getComputer;
    }
    if (getComputer != null) {
        if (gui == null) {
            gui = createGui(selectedComputer.componentName).setPosition(220,220);
            guiParams = {
                'componentSize': selectedComputer.componentSize,
                'textSize': selectedComputer.textSize,
                'textSizeMax': 32,
                'componentSizeMin': selectedComputer.componentSizeMin,
                'componentSizeMax': selectedComputer.componentSizeMax,
                'hideComponent': selectedComputer.hideComponent
            };
            gui.addObject(guiParams);
        } else {
            gui.setTitle(selectedComputer.componentName);

            gui.setValue('componentSize', selectedComputer.componentSize);
            gui.setValue('hideComponent', selectedComputer.hideComponent);
            gui.setValue('textSize', selectedComputer.textSize);

        }
    }
}


function mouseClicked() {
    allTabs.setFirstDrawConnection();
}

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

function getCurrentSelectedComputer(mouseX, mouseY) {
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
        selectedComputer.componentSize = guiParams.componentSize;
        selectedComputer.height = selectedComputer.componentSize / 1.2;
        selectedComputer.textSize = guiParams.textSize;
    }
}



// dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

