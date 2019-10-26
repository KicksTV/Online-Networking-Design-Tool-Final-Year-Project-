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

function preload() {
    compBar = componentsBarTab("Components", 500, 50, compentsBarComponents("Components"));
    compBar.init();

    compBar.setVisableCurrent();
    allTabs.add(compBar);

    compConnectionBar = componentsBarTab("Connections", 500, 50, componentsBarConnections("Connections"));
    compConnectionBar.init();
    allTabs.add(compConnectionBar);




    // Creating button icons for TABS
    button1 = Button('img/router.svg', 'component image', "router").init();
    button2 = Button('img/switch.svg', 'component image', "switch").init();
    button3 = Button('img/pc.svg', 'component image', "pc").init();
    button4 = Button('img/cat5e.png', 'Connection Image', 'Cat 5e TP').init();
    
    // Adding created buttons to TABS
    compBar.getBar().add(button1);
    compBar.getBar().add(button2);
    compBar.getBar().add(button3);
    compConnectionBar.getBar().add(button4);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
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
            if (i != allCons.getSelectedConnection()) {
                i.defaultDisplay();
            }
        });
    }
}

function applyGUIValuesToComp() {
    if (guiParams) {
        if (guiParams.Hide) {
            selectedComponent.setHideComponent(true);
        } else {
            selectedComponent.setHideComponent(false);
        }
        selectedComponent.setComponentName(guiParams.Name);
        selectedComponent.setWidth(guiParams.Width);
        h = (guiParams.Width / 1.2);
        selectedComponent.setHeight(h);
        selectedComponent.setTextSize(guiParams.TextSize);
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
            'Hide': selectedComponent.getHideComponent(),
        };
        gui.addObject(guiParams);
    } else {
        gui.setValue('Name', selectedComponent.getComponentName());
        gui.setValue('Width', selectedComponent.getWidth());
        gui.setValue('Hide', selectedComponent.getHideComponent());
        gui.setValue('TextSize', selectedComponent.getTextSize());
    }
    gui.setTitle(selectedComponent.getComponentName());
}




// dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

