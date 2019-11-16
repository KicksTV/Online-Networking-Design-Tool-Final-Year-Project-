var allComponents = (function() {
    var instance;
    
    function init() {
     
        var _components = [];
        var clickCheck = null;
        var selectedComponent = null;
        var newlyCreatedComp = null;
        var preComputer = null;

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
        function isEmpty() {
            if (_components.length == 0) {
                return true;
            }else {
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
                            _components[i].display();
                        }
                    }else {
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
            getComponent:getComponent,
            setComponent:setComponent,
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