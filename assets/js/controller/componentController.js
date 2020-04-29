var componentController = (function() {
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
        var compPropertiesPanel = null;


        function createNewComponent(id, type, imgPath, img) {
            var newcomp = new Component(id, type, imgPath, img);
            let num = getNumberOfExistingCompType(type);
            num++;
            newcomp.setComponentName(`${type}_${num}`);

            // NEED FUCNTION TO LOAD COMP PROPORTIES
            
            //TEMP needs to be removed!!!!!!!!!!!!!!!!
            if (newcomp.getType() == "Smartphone") {
                newcomp.setValidLinkningComponents([]);
            }
            else if (newcomp.getType() == "Router") {
                newcomp.addInterface(new Interface("Fast Ethernet", 4));
                newcomp.addInterface(new Interface("Serial", 2));
            }
            else if (newcomp.getType() == "Switch") {
                newcomp.addInterface(new Interface("Fast Ethernet", 12));
            }
            else if (newcomp.getType() == "PC" || newcomp.getType() == "Laptop" || 
                    newcomp.getType() == "printer" || newcomp.getType() == "Server" ||
                    newcomp.getType() == "Access Point") {
                newcomp.addInterface(new Interface("Fast Ethernet", 1));
            }

            graphCreator2.getInstance().addNode(newcomp.id);

            return newcomp;
        }
        function cloneComponent(obj) {
            let newcomp = createNewComponent(obj.getType(), obj.getImgPath(), obj.getImage())
            // attributes we wish to copy
            let attributes = ["type", "imgPath", "image", "hideComponent", "hideConnections", 
                              "componentName", "textSize", "validLinkingComponents", "width",
                              "height"]
            // goes through all attributes of obj and copies its value
            for (let key in obj) {
                for (let att in attributes) {
                    if (key == att) {
                        newcomp[key] = obj[key] 
                    }
                }
            }
            newcomp.setComponentName(newcomp.getComponentName() + " - copy");
        
            return newcomp;
        }
        function getNumberOfExistingCompType(type) {
            const found = allComps.get().filter(comp => comp.getType() == type);
            return found.length;
        }

        function initGUI(gui) {
            compPropertiesPanel = gui.addFolder("Component Properties");
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
            print(draggingNewComponent);
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
                    print("selected a comp");
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

            compPropertiesPanel.add(comp, 'name').listen();
            compPropertiesPanel.add(comp, 'x').listen();
            compPropertiesPanel.add(comp, 'y').listen();
            compPropertiesPanel.add(comp.image, 'width', 30, 200).listen();
            compPropertiesPanel.add(comp.image, 'height', 30, 200).listen();
            compPropertiesPanel.add(comp, 'correctAspectRatio').listen();

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
                        if (!comp.getHideComponent()) {
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
            var index = allComps.get().findIndex(c => c === comp);
            // creates a new list without the component.
            var newlist = allComps.get().filter((value, i, arr) => {
                return i != index; 
            });
            allComps.set(newlist);
        }
        function isEndDevice(comp) {
            var isEndDevice = false;
            if (comp.getType() == "PC" || comp.getType() == "Laptop" || 
                comp.getType() == "Printer" || comp.getType() == "Smartphone" ||
                comp.getType() == "Server") {

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

                        allComps.add(clonedComponent);
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
                    allComps.add(clonedComponent);
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
        function toJSON() {
            var json = [];

            // looping through all components to get any that haven't got a connection
            allComps.get().forEach((comp) => {
                if (!comp.hasConnection()) {
                    json.push(comp.prepareForJson());
                }
            });
            return json;
        }

        return {
            createNewComponent:createNewComponent,
            cloneComponent:cloneComponent,
            initGUI:initGUI,
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