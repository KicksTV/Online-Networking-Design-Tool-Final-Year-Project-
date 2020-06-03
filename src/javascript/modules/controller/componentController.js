// Controllers
import networkController from '../controller/networkController.js';

// Collections
import allComponents from '../collections/allComponents.js';

// Models
import Component from '../models/component.js';
import Graph from '../models/graph.js';
import Interface from '../models/Interface.js';

const componentController = (function() {
    var instance;
    
    function init() {

        
        var currentClick = null;
        var selectedComponent = null;
        var previousSelectedComp = null;
        var newlyCreatedComp = null;
        var preComputer = null;
        var _multiSelectList = [];
        var _clearedMultiSelectList = [];

        var componentHover = false;
        var componentDrag = false;
        var draggingNewComponent = false;
        var selectCompForDelete = false;

        // Copy, cut and paste booleans
        var pasted;
        var copied;
        var cut;

        // dat.GUI 
        var gui = null;
        var compPropertiesPanel = null;


        async function createNewComponent(name) {

            // Getting the default values for component attributes from xml files 
            let defaultComponent = await getDefaultComponentData(name);
            setNewlyCreatedComp(defaultComponent);

            // print("defaultComponent", defaultComponent);


            // Wait for img to be loaded
            let promise = new Promise((resolve, reject) => {
                // Loading component image
                loadImage(defaultComponent.getImgPath(), img => {
                    img.width = img.width/2;
                    img.height = img.height/2;

                    resolve(img);
                });
            });

            let img = await promise;
            defaultComponent.setIMG(img);

            
            // Default naming of created components
            let num = getNumberOfExistingCompType(defaultComponent.name);
            num++;
            if (name == `${defaultComponent.name}_${num}`) {
                defaultComponent.displayName = `${defaultComponent.name}_${num}`;
            } 
            else if (name == defaultComponent.name) {
                defaultComponent.displayName = `${defaultComponent.name}_${num}`;
            }
            else {
                defaultComponent.displayName = name;
            }

            return defaultComponent;
        }
        function cloneComponent(obj) {
            let newcomp = createNewComponent(null, obj.name, obj.type, obj.imgPath, obj.image)
            // attributes we wish to copy
            let attributes = ["type", "imgPath", "image", "hide", "hideConnections", 
                              "displayName", "textSize", "validLinkingComponents", "width",
                              "height"]
            // goes through all attributes of obj and copies its value
            for (let key in obj) {
                for (let att in attributes) {
                    if (key == att) {
                        newcomp[key] = obj[key] 
                    }
                }
            }
            newcomp.setComponentName(newcomp.displayname + " - copy");
        
            return newcomp;
        }
        function getNumberOfExistingCompType(name) {
            const found = allComponents.getInstance().get().filter(comp => comp.name == name);
            return found.length;
        }

        function initGUI(g) {
            gui = g;
            compPropertiesPanel = g.addFolder("Component Properties");
        }
        function getGUI() {
            return gui;
        }
        function getPropertiesPanel() {
            return compPropertiesPanel;
        }

        function isCurrentlyClickingComp() {
            return currentClick;
        }
        function getSelectedComponent() {
            return selectedComponent;
        }
        function setSelectedComponent(val) {
            selectedComponent = val;
        }
        function getNewlyCreatedComp() {
            return newlyCreatedComp;
        }
        function setNewlyCreatedComp(val) {
            newlyCreatedComp = val;
        }
        function getPreviousComputer() {
            return preComputer;
        }
        function getComponentHover() {
            return componentHover;
        }
        function setComponentHover(val) {
            componentHover = val;
        }
        function getComponentDrag() {
            return componentDrag;
        }
        function setComponentDrag(val) {
            componentDrag = val;
        }
        function getDraggingNewComponent() {
            return draggingNewComponent;
        }
        function setDraggingNewComponent(val) {
            draggingNewComponent = val;
        }
        function getSelectCompForDelete() {
            return selectCompForDelete;
        }
        function setSelectCompForDelete(val) {
            selectCompForDelete = val;
        }
        function hasClickedSelectedComponent() {
            var hasClicked = false;

            if (currentClick == selectedComponent) {
                if (previousSelectedComp == selectedComponent) {
                    hasClicked = true;
                }
            }

            return hasClicked;
        }
        function isSelectedComp(comp) {
            var isSelectedComp = false;
            if (selectedComponent) {
                if (comp.getID() == selectedComponent.getID()) {
                    isSelectedComp = true;
                }
                else if (_multiSelectList.length > 1) {
                    _multiSelectList.forEach((c) => {
                        if (comp.getID() == c.getID()) {
                            isSelectedComp = true;
                        }
                    });
                }
            }
            return isSelectedComp;

        }
        function checkForSelectedComponent(mouseX, mouseY) {
            let _components = allComponents.getInstance().get();

            let clickedComponent = null;

            _components.forEach((comp) => {
                var clicked = comp.clicked(mouseX, mouseY);
                if (clicked) {
                    clickedComponent = comp;
                    // print("selected a comp");
                }
            });

            currentClick = clickedComponent;
            
            if (currentClick != null) {
                previousSelectedComp = selectedComponent;
                selectedComponent = currentClick;
            }
            return;
        }
        function applyGUIValues() {
            var att = Object.keys(gui.__folders);
            if (compPropertiesPanel != null && att.length > 1 || att[1] == "Component Properties") {
                gui.removeFolder(compPropertiesPanel);
            }
            compPropertiesPanel = gui.addFolder("Component Properties");
            let comp = getSelectedComponent();

            compPropertiesPanel.add(comp, 'displayName').listen();
            compPropertiesPanel.add(comp, 'x').listen();
            compPropertiesPanel.add(comp, 'y').listen();
            compPropertiesPanel.add(comp, 'textSize', 8, 32).listen();
            compPropertiesPanel.add(comp.image, 'width', 30, 200).listen();
            compPropertiesPanel.add(comp.image, 'height', 30, 200).listen();

            compPropertiesPanel.add(comp, 'applyAspectRatio').listen();

            compPropertiesPanel.add(comp, 'hide').listen();
            compPropertiesPanel.add(comp, 'hideConnections').listen();

            compPropertiesPanel.open();

        }
        function displayAllComponents() {
            let _components = allComponents.getInstance().get();
            if (_components.length > 0) {
                _components.forEach((comp) => {
                    // Checks if undefined
                    if (typeof comp !== 'undefined') {
                        // Check if hideComponent is true or false
                        if (!comp.getHideComponent() && comp.image) {
                            if (isSelectedComp(comp)) {
                                push(); // Start a new drawing state
                                stroke(color(0, 0, 255));
                                strokeWeight(1);
                                rect(comp.getXpos()-20, comp.getYpos()-20, comp.getWidth()+40, comp.getHeight()+40);
                                pop(); // Restore original state
                            }
                            comp.display();
                        }
                    } else {
                        console.log("comp undefined");
                    }
                });
            }
        }
        function doesComponentExist(id) {
            let _components = allComponents.getInstance().get();
            if (_components.length > 0) {
                _components.forEach((comp) => {
                    // console.log(comp.getID());
                    // console.log(id);
                    // console.log(comp.getID() == id);
                    if (comp.getID() == id) {
                        return true;
                    }
                });
            }else {
                return false;
            }
        }
        function removeComponent(comp) {
            var index = allComponents.getInstance().get().findIndex(c => c === comp);
            // creates a new list without the component.
            var newlist = allComponents.getInstance().get().filter((value, i, arr) => {
                return i != index; 
            });
            allComponents.getInstance().set(newlist);
        }
        function isEndDevice(comp) {
            var isEndDevice = false;
            if (comp.name == "PC" || 
                comp.name == "Laptop" || 
                comp.name == "Printer" || 
                comp.name == "Smartphone" ||
                comp.name == "Server") {

                    isEndDevice = true;
            }
            return isEndDevice;
        }
        function addSelectList(comp) {
            _multiSelectList.push(comp);
        }
        function getSelectList() {
            return _multiSelectList;
        }
        function clearSelectList() {
            _clearedMultiSelectList = _multiSelectList;
            _multiSelectList = [];
        }
        function isSelectListEmpty() {
            if (_multiSelectList.length == 0) {
                return true;
            } else {
                return false;
            }
        }
        function checkForMultiSelect() {
            // CTRL Key
            if (keyIsDown(17)) {
                return true;
            }else {
                return false;
            }
        }
        function initMultiSelectList() {
            if (previousSelectedComp != null && selectedComponent != null) {
                _multiSelectList.push(previousSelectedComp);
                _multiSelectList.push(selectedComponent);
            }
        }
        function getClearedMultiSelectList() {
            return _clearedMultiSelectList;
        }
        function isClearedSelectListEmpty() {
            if (_clearedMultiSelectList.length == 0) {
                return true;
            } else {
                return false;
            }
        }
        function copySelectedComponents() {
            if (selectedComponent) {
                copied = true;
                pasted = false;
                print("copied"); 
            }
        }
        function cutSelectedComponents() {
            if (selectedComponent) {
                cut = true;
                pasted = false;
                print("Component is cut"); 
            }
        }
        function pasteSelectedComponents() {
            if (! isSelectListEmpty()) {
                print("multi select paste");
                var list = _multiSelectList;
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

                    if (copied) {
                        var clonedComponent = cloneComponent(list[i]);
    
                        clonedComponent.setXpos(mouseX + xDifference);
                        clonedComponent.setYpos(mouseY + yDifference);

                        allComponents.getInstance().add(clonedComponent);
                    }
                }
                copied = false;
                pasted = true;
                print("paste"); 
            }
            
            if (compContrInstance.getSelectedComponent()) {
                if (copied) {
                    let clonedComponent = cloneComponent(selectedComponent);
                    clonedComponent.setXpos(mouseX);
                    clonedComponent.setYpos(mouseY);
                    allComponents.getInstance().add(clonedComponent);
                    copied = false;
                }
                else if (cut) {
                    var comp = selectedComponent;
                    comp.setXpos(mouseX);
                    comp.setYpos(mouseY);
                    cut = false;
                }
                pasted = true;
                print("paste"); 
            }
            clearSelectList();
        }
        function hasCopiedComponent() {
            return copied;
        }
        function hasPastedComponent() {
            return pasted;
        }

        function makePortAvailable(comp, interfaceAndPort) {
            // print("interfaceAndPort", interfaceAndPort);
            let inte = interfaceAndPort[0];
            let number = interfaceAndPort[1];
            let compInterface = comp.getInterfaces().find(thisInterface => thisInterface.id === inte.id);
            inte.portAvailability[number] = true;
            compInterface.portAvailability[number] = true;
        }

        function toJSON() {
            var json = [];
            // looping through all components to get any that haven't got a connection
            allComponents.getInstance().get().forEach((comp) => {
                json.push(comp.prepareForJson());
            });
            return json;
        }

        async function getDefaultComponentData(name) {
            
            let promise = new Promise((resolve, reject) => {
                loadXML(`/assets/components/${name}.xml`, (xml) => {
                    resolve(xml);
                });
            });
            
            let data = await promise;
            
            let type = data.getChild('type').getContent();
            let image = data.getChild('image').getString('path');

            var defaultComponent = new Component(null, name, type, image, null);

            for (let getInter of data.getChild("interfaces").getChildren()) {
                // print(getInter.getString('portType'));
                let portType = getInter.getString('portType');
                let numberOfPorts = getInter.getString('numberOfPorts');
                let newInter = new Interface(null, portType, "Network_Card", numberOfPorts);
                defaultComponent.addInterface(newInter);
            }
            let validLinkingComps = [];
            for (let getValidLinkingComp of data.getChild("validLinkingComponents").getChildren()) {
                validLinkingComps.push(getValidLinkingComp.getContent());
            }
            defaultComponent.setValidLinkningComponents(validLinkingComps);

            return defaultComponent;
        }

        return {
            createNewComponent:createNewComponent,
            cloneComponent:cloneComponent,
            initGUI:initGUI,
            getGUI:getGUI,
            getPropertiesPanel:getPropertiesPanel,
            isCurrentlyClickingComp:isCurrentlyClickingComp,
            getSelectedComponent:getSelectedComponent,
            setSelectedComponent:setSelectedComponent,
            getNewlyCreatedComp:getNewlyCreatedComp,
            setNewlyCreatedComp:setNewlyCreatedComp,
            getPreviousComputer:getPreviousComputer,
            getComponentHover:getComponentHover,
            setComponentHover:setComponentHover,
            getComponentDrag:getComponentDrag,
            setComponentDrag:setComponentDrag,
            getDraggingNewComponent:getDraggingNewComponent,
            setDraggingNewComponent:setDraggingNewComponent,
            getSelectCompForDelete:getSelectCompForDelete,
            setSelectCompForDelete:setSelectCompForDelete,
            hasClickedSelectedComponent:hasClickedSelectedComponent,
            isSelectedComp:isSelectedComp,
            checkForSelectedComponent:checkForSelectedComponent,
            displayAllComponents:displayAllComponents,
            applyGUIValues:applyGUIValues,
            doesComponentExist:doesComponentExist,
            removeComponent:removeComponent,
            isEndDevice:isEndDevice,
            addSelectList:addSelectList,
            getSelectList:getSelectList,
            clearSelectList:clearSelectList,
            isSelectListEmpty:isSelectListEmpty,
            checkForMultiSelect:checkForMultiSelect,
            initMultiSelectList:initMultiSelectList,
            getClearedMultiSelectList:getClearedMultiSelectList,
            isClearedSelectListEmpty:isClearedSelectListEmpty,
            copySelectedComponents:copySelectedComponents,
            cutSelectedComponents:cutSelectedComponents,
            pasteSelectedComponents:pasteSelectedComponents,
            hasCopiedComponent:hasCopiedComponent,
            hasPastedComponent:hasPastedComponent,
            makePortAvailable:makePortAvailable,
            toJSON:toJSON,
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

export default componentController;