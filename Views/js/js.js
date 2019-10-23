let xml;
let json;

let canvas;

var allTabs = allComponentBarTabs.getInstance();
var allCons = allConnections.getInstance();

var allComponents = [];
var getComponent;
var selectedComponent;
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

    drawAllConnections();
    applyGUIValues();
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


        if (gui == null) {
            gui = createGui(selectedComponent.componentName).setPosition(220,220);
            guiParams = {
                'width': selectedComponent.getWidth(),
                'textSize': selectedComponent.getTextSize(),
                'textSizeMax': 32,
                'widthMin': selectedComponent.getWidthMin(),
                'widthMax': selectedComponent.getWidthMax(),
                'hideComponent': selectedComponent.getHideComponent(),
            };
            gui.addObject(guiParams);
        } else {
            gui.setValue('width', selectedComponent.getWidth());
            gui.setValue('hideComponent', selectedComponent.getHideComponent());
            gui.setValue('textSize', selectedComponent.getTextSize());
        }
        gui.setTitle(selectedComponent.getComponentName());

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
        // allCons.get().forEach((i) => {
        //     centerPos = i.getComponents()[0].getCenterPos();
        //     x = centerPos[0];
        //     y = centerPos[1];
        //     mousePos = i.getMousePos();
        //     line(x, y, mousePos[0], mousePos[1]);
        // });

        allCons.get().forEach((i) => {
            i.compSelectDisplay();
        });
    }else {
        allCons.get().forEach((i) => {
            if (i != allCons.getSelectedConnection()) {
                i.defaultDisplay();
            }
        });
    }
}

function applyGUIValues() {
    if (guiParams) {
        if (guiParams.hideComponent) {
            selectedComponent.setHideComponent(true);
        } else {
            selectedComponent.setHideComponent(false);
        }
        selectedComponent.setWidth(guiParams.width);
        h = (guiParams.width / 1.2);
        selectedComponent.setHeight(h);
        selectedComponent.setTextSize(guiParams.textSize);
    }
}



// dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

