let xml;
let json;

var allComputers = [];
var getComputer;
var selectedComputer;
var preComputer;

var guiParams;

let compBar;
let compConnectionBar


let c;

let gui;

var img;

function preload() {
    compBar = new componentsBarLabel("Components", 500, 50);
    compBar.setCurrent(true);
    compConnectionBar = new componentsBarLabel("Connections", 500, 50);


    c = new Button('../img/computer.png', 'component image');
    compBar.buttons.push(c);

    img = loadImage('../img/Lely1-01.svg');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    compBar.display();
    compBar.displayAllButtons();

    compConnectionBar.display();

    
    //saveJSON(comp.prepareForJson(), 'mycomputer.json');

}
function draw() {
    clear();


    applyGUIValues();

    displayAllComputers();

    image(img,0,0,100,100);
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
    for (var i=0; i<allComputers.length;i++) {
        var clicked = allComputers[i].clicked(mouseX, mouseY);
        if (clicked) {
            return allComputers[i];
        }
    }
    return null;
}

function displayAllComputers() {
    if (allComputers.length > 0) {
        for (var i=0; i<allComputers.length;i++) {

            // Check if hideComponent is true or false
            if (!allComputers[i].hideComponent) {
                allComputers[i].display();
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
        selectedComputer.textSize = guiParams.textSize;
    }
}

// dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

