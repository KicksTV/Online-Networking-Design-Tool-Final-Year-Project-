// Controllers
import componentController from './componentController.js';
import connectionController from './connectionController.js';
import networkController from './networkController.js';
import ioController from './ioController.js';
import panelController from './panelController.js';
import saveLoadController from './saveLoadController.js';


// Collections
import allVRules from '../collections/allValidationRules.js';
import allComponents from '../collections/allComponents.js';

// Models
import validationRule from '../models/validationRule.js';
import Graph from '../models/graph.js';
import allConnections from '../collections/allConnections.js';

// View
import InterfaceView from '../views/InterfaceView.js';

const GUI = require('dat.gui').GUI;
import p5 from 'p5';
import ProjectSettingsController from './ProjectSettingsController.js';
const _ = require('lodash');


const p5Controller = (function() {
    var instance;
    
    function init() {

        // dat.GUI
        var gui = null

        // Panels or Bars
        // var compBar;
        // var compConnectionBar;

        //EVENTS
        // var componentCslickEvent = new CustomEvent('componentClickEvent');

        var _allCanvases = []
        var _pressed_keys = []
        var currentCanvas = null
        var selectedInterfaceView = null
        var mousePressedEvent = null


        function getCanvas() {
            return currentCanvas;
        }
        function useFunc(func) {
            return currentCanvas[func];
        }
        function createNewCanvas() {
            var newP5 = new p5(function(p5) {
                p5.preload = function() {
                    currentCanvas = this;

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
                
                
                    gui = new GUI({ autoPlace: false });
                    var con = document.getElementById("rightSidePanel");
                    con.appendChild(gui.domElement);
                    gui.width = 400;
            
                    networkController.initGUI(gui);
                
                    networkController.initNetworkListener(gui);

                    panelController.getInstance();


                    if (window.$vue._route.params) {
                        // Project settings
                        if (window.$vue._route.params.projectSettings) {
                            let settings = window.$vue._route.params.projectSettings
                            // console.log(settings)
                            ProjectSettingsController.setSettings(settings)
                        }
                        // Pre load project
                        if (window.$vue._route.params.loadedProject) {
                            let project =window.$vue._route.params.loadedProject.json
                            saveLoadController.loadProject(project)
                        }
                    }


                    
                }
                p5.setup = function() {
                    p5.frameRate(60);
                    let canvas = p5.createCanvas((p5.windowWidth-20), p5.windowHeight-203);
                    canvas.parent("canvasDiv");

                    componentController.initGUI(gui);
                     
                }
                p5.draw = function() {
                    p5.clear();
                    
                    drawAllConnections();
                    displayAllComponents();
                    //updateMouseCursor();
            
                    checkComponentDeleteEvent();
                
                }
                p5.mousePressed = function() {
                    if (mousePressedEvent) {
                        mousePressedEvent(p5.mouseX, p5.mouseY)
                    } else {
                        defaultMousePressedEvent()
                    }
                }
                p5.mouseMoved = function() {
                    if (componentController.isCurrentlyClickingComp() != null) {
                        componentController.setComponentHover(true);
                    }else {
                        componentController.setComponentHover(false);
                    }
                    
                    if (connectionController.getDrawConnection()) {
                        connectionController.drawConnetions(p5.mouseX, p5.mouseY);
                    }
                }
                p5.mouseDragged = function(event) {
                    // console.log(event.movementX);
                    // console.log(event.movementY);
            
                    // MULTI MOVE COMPONENTS
                    if (componentController.getSelectList().length > 1) {
                        // console.log("multi move");
                        componentController.getSelectList().forEach((c) => {
                            c.multiMove(event.movementX, event.movementY);
                        });
                        componentController.setComponentDrag(true);
                    }
                    // STANDARD MOVE EVENT
                    else if (componentController.isCurrentlyClickingComp() != null && !connectionController.getDrawConnection()) {
                        // console.log("default move");
                        var comp = componentController.getSelectedComponent();
                        p5.moveComponent(comp, p5.mouseX, p5.mouseY);
                        componentController.setComponentDrag(true);
            
                        // SENDING DATA TO OTHER USERS
                        ioController.sendData('componentMove', componentController.getSelectedComponent().prepareForJson());
                    }
            
                    // DRAGGING NEWLY CREATED COMPONENTS
                    if (componentController.getDraggingNewComponent()) {
            
                        // Catching expected error when dragging component before it has been created
                        try {
                            // console.log("move new")
                            comp = componentController.getSelectedComponent();
                            p5.moveComponent(comp, p5.mouseX, p5.mouseY);
                        } catch (error) {
                            // console.error(error);
                            // expected output: ReferenceError: nonExistentFunction is not defined
                            // Note - error messages will vary depending on browser
                        }
                        componentController.setComponentDrag(true);
                    }
                }
                p5.mouseReleased = function() {
                    if (componentController.isCurrentlyClickingComp()) {
                        componentController.getSelectedComponent().setIsClicked(false);
                    }
                    componentController.setDraggingNewComponent(false);
                    componentController.setNewlyCreatedComp(null);
                    componentController.setComponentDrag(false);
                }

                p5.keyPressed = function() {
                    _pressed_keys.push(p5.keyCode)

                     // COPY
                    if (_pressed_keys[0] === 17  && _pressed_keys[1] === 67) {
                        componentController.copySelectedComponents()
                        window.$vue.makeToast("Copied Components", "The selected componets have been copied!", true)
                    }
                    // CUT 
                    if (_pressed_keys[0] === 17 && _pressed_keys[1] === 88) {
                        componentController.cutSelectedComponents()
                        window.$vue.makeToast("Cut Components", "The selected componets have been cut!", true)
                    }
                    // PASTE
                    if (_pressed_keys[0] === 17 && _pressed_keys[1] === 86 && componentController.hasPastedComponent() == false) {
                        pasteSelectedComponents();
                        window.$vue.makeToast("Paste Components", "The selected componets have been pasted!", true)

                        // Triggering networkChangeEvent
                        networkController.dispatchNetworkChangeEvent();
                    }
                }
                p5.keyReleased = function() {
                    _pressed_keys = _.remove(_pressed_keys, k => k != p5.keyCode)
                }
                
                // dynamically adjust the canvas to the window
                p5.windowResized = function() {
                    // print("resize window");
                    p5.resizeCanvas((p5.windowWidth-20), p5.windowHeight-203);
                }
                
                function displayAllComponents() {
                    let _components = allComponents.getAll();
                    if (_components.length > 0) {
                        _components.forEach((comp) => {
                            // Checks if undefined
                            if (typeof comp !== 'undefined') {
                                // Check if hideComponent is true or false
                                if (!comp.getHideComponent() && comp.image) {
                                    if (componentController.isSelectedComp(comp)) {
                                        p5.push(); // Start a new drawing state
                                        p5.stroke(p5.color(0, 0, 255));
                                        p5.strokeWeight(1);
                                        p5.rect(comp.getXpos()-20, comp.getYpos()-20, comp.getWidth()+40, comp.getHeight()+40);
                                        p5.pop(); // Restore original state
                                    }
                                    displayComponent(comp);
                                    
                                }
                            } else {
                                throw {name : "ComponentUndefined", message : "Component in components list is undefined!!"}; 
                            }
                        });
                    }
                }

                function drawAllConnections() {
                    allConnections.get().forEach((con) => {
                        if (connectionController.getSelectingSecondConnection() && con == allConnections.getSelectedConnection()) {
                            connectionSelectDisplay(con);
                        }else {
                            // Prevents displaying incomplete set connections
                            let comp1 = con.getComponent(0),
                                comp2 = con.getComponent(1);
                            if (comp1 && comp2) {
                                if (comp1.image && comp2.image) {
                                    // Checks if linking component wishs to hide its connection
                                    if (!con.isHidden()) {
                                        p5.push(); // Start a new drawing state
                                        p5.strokeWeight(2);
                                        connectionDefaultDisplay(con);
                                        p5.pop(); // Restore original state
        
                                        displayCompIPaddress(con)
                                    }
                                }
                            }
                        }
                    });
                }
    
                function displayComponent(comp) {
                    p5.image(comp.image, comp.x, comp.y);
                    p5.noStroke();
                    p5.textSize(comp.textSize);
                    p5.text(comp.displayName, comp.x, comp.y + comp.image.height, comp.image.width, 30);
                    p5.textAlign(p5.CENTER, p5.CENTER);
                }

                p5.moveComponent = function(comp, x, y) {
                    x = x - (comp.image.width/2);
                    y = y - (comp.image.height/2);
                    
                    if ((p5.windowWidth) > (x + comp.image.width) && 0 < x) {
                        comp.x = x;
                    }
                    if (p5.windowHeight > (y + comp.image.height) && 0 < y) {
                        comp.y = y;
                    }
                }
    
                function connectionSelectDisplay(con)  {
                    let centerPos = con._components[0].getCenterPos();
                    let x = centerPos[0];
                    let y = centerPos[1];
                    p5.push();
                    p5.stroke('black');
                    p5.strokeWeight(2);
                    p5.line(x, y, con.mousePos[0], con.mousePos[1]);
                    p5.pop();
                }

                function connectionDefaultDisplay(con)  {
                    let centerPos1 = con._components[0].getCenterPos();
                    let centerPos2 = con._components[1].getCenterPos();
                    let x1 = centerPos1[0];
                    let y1 = centerPos1[1];
                    let x2 = centerPos2[0];
                    let y2 = centerPos2[1];
            
                    p5.push();
                    p5.stroke('black');
                    p5.line(x1, y1, x2, y2);
                    p5.pop();
                }
    
                function displayCompIPaddress(connection) {
                    let comp1 = connection.getComponent(0);
                    let comp2 = connection.getComponent(1);
        
                    let ipaddresses = [connection.getIPaddress(0), connection.getIPaddress(1)]
                    if (!_.isEqual(ipaddresses, ["", ""])) {
                        for (var i=0;i<=1;i++) {
                            // get x & y coords of both components
                            let center1 = comp1.getCenterPos();
                            let center2 = comp2.getCenterPos();
        
                            let x1 = center1[0], 
                                x2 = center2[0],
                                y1 = center1[1], 
                                y2 = center2[1];
        
                            // Gets the position which is a quarter between the two components
                            let quarterX = connection.getComponent(i) == comp1 ? p5.lerp(x1, x2, 0.25) : p5.lerp(x1, x2, 0.75);
                            let quarterY = connection.getComponent(i) == comp1 ? p5.lerp(y1, y2, 0.25) : p5.lerp(y1, y2, 0.75);
                            let d = p5.dist(x1, y1, x2, y2);
        
                            let angle = x1 < x2 ? p5.atan2(y2 - y1, x2 - x1) : p5.atan2(y1 - y2, x1 - x2);
        
                            // Will only show if distance is greater than 250
                            if (d > 250) {
                                p5.push();
                                p5.translate(quarterX, quarterY);
                                p5.rotate(angle);
                                p5.text(ipaddresses[i], 0, -5);
                                p5.pop();
                            }
                        }
                    }
                }

                function defaultMousePressedEvent() {
                    let multiSelect = checkForMultiSelect();
                    componentController.checkForSelectedComponent(p5.mouseX, p5.mouseY);
                
                    if (componentController.isCurrentlyClickingComp() != null) {
                        if (!componentController.hasClickedSelectedComponent() && !multiSelect) {
                            // print("clear select list");
                            componentController.clearSelectList();
                        }
                        
                        if (multiSelect) {
                            if (!componentController.hasClickedSelectedComponent()) {
                                if (componentController.isSelectListEmpty()) {
                                    componentController.initMultiSelectList();
                                } else {
                                    componentController.addSelectList(componentController.isCurrentlyClickingComp());
                                }
                            }
                        }
                    }else {
                        // checking if the user is clicking the bin icon, if so then dont clear select list.
                        if (p5.mouseX > 104 && p5.mouseY > 39) {
                            if (!componentController.hasClickedSelectedComponent() && !multiSelect) {
                                // print("clear select list");
                                componentController.clearSelectList();
                            }
                            if (!componentController.hasCopiedComponent()) {
                                componentController.clearSelectList();
                            }
                        }
                    }
                }

                async function pasteSelectedComponents() {
                    if (! componentController.isSelectListEmpty()) {
                        console.log("multi select paste");
                        var list = componentController.getSelectList();
                        for (var i=0; i<list.length;i++) {
                            
                            var firstCX;
                            var firstCY;
                            var nextCX;
                            var nextCY;
                            var xDifference;
                            var yDifference;
            
                            firstCX = list[0].getXpos();
                            firstCY = list[0].getYpos();
            
                            if (i == 0) {
                                //print("First item");
                                xDifference = 0;
                                yDifference = 0;
                            }
                            else {
                                //print("Middle item");
                                nextCX = list[i].getXpos();
                                nextCY = list[i].getYpos();
            
                                xDifference = nextCX - firstCX;
                                yDifference = nextCY - firstCY;
                            }
        
                            if (componentController.getCopy()) {
                                let clonedComponent = _.cloneDeep(list[i])
                                clonedComponent.displayName += '_copy'
                                clonedComponent.resetID()
                                clonedComponent.setXpos(p5.mouseX + xDifference)
                                clonedComponent.setYpos(p5.mouseY + yDifference)
        
                                allComponents.add(clonedComponent)
                            }
                        }
                        componentController.setCopied(false)
                        componentController.setPasted(true)
                        console.log("paste")
                    }
                    
                    if (componentController.getSelectedComponent()) {
                        var selectedComponent = componentController.getSelectedComponent();
                        if (componentController.getCopy()) {
                            let clonedComponent = _.cloneDeep(selectedComponent)
                            clonedComponent.resetID()
                            clonedComponent.displayName += '_copy'
                            clonedComponent.setXpos(p5.mouseX);
                            clonedComponent.setYpos(p5.mouseY);
                            allComponents.add(clonedComponent);
                            componentController.setCopied(false);
                        }
                        else if (componentController.getCut()) {
                            var comp = selectedComponent;
                            comp.setXpos(p5.mouseX);
                            comp.setYpos(p5.mouseY);
                            componentController.setCut(false);
                        }
                        componentController.setPasted(true);
                        console.log("paste"); 
                    }
                    componentController.clearSelectList();
                }
    
                function checkForMultiSelect() {
                    // CTRL Key
                    if (p5.keyIsDown(17)) {
                        return true;
                    }else {
                        return false;
                    }
                }
                
                function checkComponentDeleteEvent() {
                    // Checks if user has pressed the delete canvas button
                
                    if (componentController.getSelectCompForDelete()) {
                        
                        // print("IsSelectListEmpty: " + componentController.isSelectListEmpty());
                
                        // print("List: " + componentController.getSelectList());
                
                        if (! componentController.isSelectListEmpty()) {
                            console.log("multi select delete");
                            var list = componentController.getSelectList();
                
                            list.forEach((comp) => {
                                componentController.removeComponent(comp);
                                // Delete related connections
                                connectionController.deleteConnection(comp);
                            });
                            gui.removeFolder(componentController.getPropertiesPanel());
                        } 
                        else if (componentController.getSelectedComponent() != null) {
                            var comp = componentController.getSelectedComponent();
                            componentController.removeComponent(comp);
                            // Delete related connections
                            connectionController.deleteConnection(comp);
                
                            // $('#deleteToastAlert').toast('show');
                            // $('#deleteToastAlert .toast-body').text(
                            //     componentController.getSelectedComponent().displayName + " has been deleted."
                            // );
                
                            gui.removeFolder(componentController.getPropertiesPanel());
                
                        }
                        Graph.getInstance().updateGraph();
                
                        // Triggering networkChangeEvent
                        networkController.dispatchNetworkChangeEvent();
                
                        componentController.setSelectCompForDelete(false);
                    }
                }

                p5.createInterfaceView = function(interfaces) {
                    var interfaceView = new InterfaceView(p5, interfaces);
                    interfaceView.create(p5);
                    interfaceView.show(p5.winMouseX, p5.winMouseY);

                    selectedInterfaceView = interfaceView;
                }
                p5.clearInterfaceView = function() {
                    selectedInterfaceView.clear();
                }
                p5.hideInterfaceView = function() {
                    selectedInterfaceView.hide();
                }
                
            });

            // function updateMouseCursor() {
            //     if (componentController.getComponentDrag()) {
            //         document.body.style.cursor = "grabbing";
            //     }
            //     else if (connectionController.getDrawConnection() || componentController.getSelectCompForDelete()) {
            //         document.body.style.cursor = "crosshair";
            //     }
            //     else if (componentController.getComponentHover()) {
            //         document.body.style.cursor = "grab";
            //     }
            //     else {
            //         document.body.style.cursor = "default"; 
            //     }
            // }
            

            _allCanvases.push(newP5);
            currentCanvas = newP5;
        }

        function getMousePressedEvent() {
            return mousePressedEvent
        }

        function setMousePressedEvent(func) {
            mousePressedEvent = func
        }

        return {
            useFunc:useFunc,
            getCanvas:getCanvas,
            createNewCanvas:createNewCanvas,
            getMousePressedEvent:getMousePressedEvent,
            setMousePressedEvent:setMousePressedEvent,
        };   
    }
    return {
        getInstance: () => {
            if (!instance) {
                instance = init();
            }

            return instance
        }
    }
})();

export default p5Controller.getInstance();
