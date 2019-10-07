let xml;
let json;

var currMenu;

var allLabels = [];
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
    compBar = componentsBarLabel("Components", 500, 50);
    compBar.init();
    compBar.setCurrent(true);
    compBar.bar = compentsBarComponents(compBar.title);
    allLabels.push(compBar);

    compConnectionBar = componentsBarLabel("Connections", 500, 50);
    compConnectionBar.init();
    compConnectionBar.bar = componentsBarConnections(compConnectionBar.title);
    allLabels.push(compConnectionBar);





    button1 = Button('img/router.svg', 'component image', "router");
    button2 = Button('img/switch.svg', 'component image', "switch");
    button3 = Button('img/pc.svg', 'component image', "pc");
    compBar.bar.buttons.push(button1);
    compBar.bar.buttons.push(button2);
    compBar.bar.buttons.push(button3);

    compConnectionBar.bar.buttons.push(button3);
    compConnectionBar.bar.buttons.push(button2);
    compConnectionBar.bar.buttons.push(button1);

}

function setup() {
    createCanvas(windowWidth, windowHeight);

    compBar.display();
    compBar.bar.display();
    compBar.bar.displayAllButtons();

    compConnectionBar.display();

}
function draw() {
    clear();


    applyGUIValues();

    displayAllComputers();
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

function displayAllComputers() {
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

