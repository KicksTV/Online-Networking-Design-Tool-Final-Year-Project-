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