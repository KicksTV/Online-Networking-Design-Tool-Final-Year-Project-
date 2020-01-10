var allComponents = (function() {
    var instance;
    
    function init() {
     
        var _components = [];
        var clickCheck = null;
        var selectedComponent = null;
        var newlyCreatedComp = null;
        var preComputer = null;
        var _multiSelectList = [];

        var componentHover = false;
        var componentDrag = false;
        var draggingNewComponent = false;
        var selectCompForDelete = false;
        
        function get() {
            return _components;
        }
        function set(newlist) {
            _components = newlist;
        }
        function add(comp) {
            _components.push(comp);
        }
        function length() {
            return _components.length;
        }
        function getComponent() {
            return clickCheck;
        }
        function setComponent(val) {
            clickCheck = val;
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
        function hasClickedSelectedComponent(comp) {
            var b = false;
            if (comp == selectedComponent) {
                b = true;
            }else {
                _multiSelectList.forEach((c) => {
                    if (c.getID() === comp.getID()) {
                        console.log(c.getID() === comp.getID());
                        b = true;
                    }
                });
            }
            return b;
        }
        function isEmpty() {
            if (_components.length == 0) {
                return true;
            } else {
                return false;
            }
        }
        function addSelectList(comp) {
            _multiSelectList.push(comp);
        }
        function getSelectList() {
            return _multiSelectList;
        }
        function clearSelectList() {
            _multiSelectList = [];
        }
        function isSelectListEmpty() {
            if (_multiSelectList.length == 0) {
                return true;
            } else {
                return false;
            }
        }
        function displayAllComponents() {
            if (_components.length > 0) {
                for (var i=0; i<_components.length;i++) {
                    // Checks if undefined
                    if (typeof _components[i] !== 'undefined') {
                        // Check if hideComponent is true or false
                        if (!_components[i].getHideComponent()) {
                            if (allComps.hasClickedSelectedComponent(_components[i])) {
                                stroke(color(0, 0, 255));
                                strokeWeight(1);
                                rect(_components[i].getXpos()-20, _components[i].getYpos()-20, _components[i].getWidth()+40, _components[i].getHeight()+40);
                            }
                            _components[i].display();
                        }
                    } else {
                        console.log("comp undefined");
                    }
                }
            }
        }
        function getCurrentSelectedComponent(mouseX, mouseY) {
            for (var i=0; i<_components.length;i++) {
                var clicked = _components[i].clicked(mouseX, mouseY);
                if (clicked) {
                    return _components[i];
                }
            }
            return null;
        }
        function doesComponentExist(id) {
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

        return {
            get:get,
            set:set,
            add:add,
            length:length,
            getComponent:getComponent,
            setComponent:setComponent,
            addSelectList:addSelectList,
            getSelectList:getSelectList,
            clearSelectList:clearSelectList,
            isSelectListEmpty:isSelectListEmpty,
            hasClickedSelectedComponent:hasClickedSelectedComponent,
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
            isEmpty:isEmpty,
            displayAllComponents:displayAllComponents,
            getCurrentSelectedComponent:getCurrentSelectedComponent,
            doesComponentExist:doesComponentExist,
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