let xml;
let json;

var allTabs = allComponentBarTabs.getInstance();

var allComps = allComponents.getInstance();
var allVRules = allValidationRules.getInstance();

// Copy, cut and paste booleans
var pasted;
var copied;
var cut;


var numberOfSubnetsForComponent = 0;

var guiParams;

let compBar;
let compConnectionBar;
let button1, button2, button3, button4;

var compPropertiesGUIContainer;
let compPropertiesGUI;

var networkPropertiesGUIContainer;
let networkPropertiesGUI;


var canvasSideBar;
var canvas;
var canvasLoadProject;
var canvasSaveProject;
var canvasDeleteButton;

// Network Values
var SubnetMask;
var SupernetMask;

//EVENTS
var networkChangeEvent = new CustomEvent('networkChangeEvent');
var componentClickEvent = new CustomEvent('componentClickEvent');

window.onload = function() {

    networkPropertiesGUIContainer = document.getElementById("GUI_qs_1");
    compPropertiesGUIContainer = document.getElementById("GUI_qs_2");
   
    // Adding Event Listeners to Properties bars
    networkPropertiesGUIContainer.addEventListener('networkChangeEvent', applyNetworkPropertiesToGUI);
    compPropertiesGUIContainer.addEventListener('networkChangeEvent', applyCompValuesToGUI);
    compPropertiesGUIContainer.addEventListener('change', applyGUIValuesToComp, true);    


    canvasDeleteButton = document.getElementById("canvasDeleteButton");
    canvasLoadProject = document.getElementById("canvasLoadProject");
    canvasSaveProject = document.getElementById("canvasSaveProject");


    // LOAD
    var input = document.getElementById("upload_input");
    canvasLoadProject.addEventListener("click", () => {
        input.click();
    });
    input.onchange = function (evt) {
        var result = evt.target;
        if ('files' in result) {
            if (result.files.length == 0) {
                // user didnt select file
            }else {
                var files = result.files;
                // loops all selected files or file
                for (var i=0, f;f = files[i]; i++) {
                    var reader = new FileReader();

                    // Only process json files.
                    if (!f.type.match('json.*')) {
                        alert("Not JSON File!");
                        continue;
                    }

                    // Closure to capture the file information.
                    reader.onload = (function(theFile) {
                        return function(e) {
                            console.log("running loadJSON");
                            loadJSON(e.target.result, loadComponents);
                        };
                    })(f);

                    reader.onerror = (evt) => {
                        if(evt.target.error.name == "NotReadableError") {
                            // The file could not be read
                            console.log("file could not be read");
                        }
                    }
                    reader.readAsDataURL(f);
                }
            }
        }
    }

    // SAVE
    canvasSaveProject.addEventListener("click", () => {
        // Setup of json format
        var json = {
            "connections": [],
            "components": [],
            "subnets": [],
        };
        // Checking if anything exists on canvas
        if (!allComps.isEmpty()) {
            // looping through all connections
            allConnections.getInstance().get().forEach((c) => {
                var newcon = Connection();
                newcon.setType(c.getType());
                newcon.setMousePos(c.getMousePos()[0], c.getMousePos()[1]);
                //print(c.getComponent(0).prepareForJson());
                //print(c.getComponent(1).prepareForJson());
                newcon.addComponent(c.getComponent(0).prepareForJson());
                newcon.addComponent(c.getComponent(1).prepareForJson());
                newcon.addInterfacePort(c.getInterfacePort(0));
                newcon.addInterfacePort(c.getInterfacePort(1));
                json.connections.push(newcon.getJSON());
            });
            // looping through all components to get any that haven't got a connection
            allComps.get().forEach((c) => {
                //print("pushing non-connection object");
                //print(c.hasConnection());
                if (!c.hasConnection()) {
                    json.components.push(c.prepareForJson());
                }
            });

            // Saving all subnets
            allSubnets.getInstance().getAll().forEach(s => {
                json.subnets.push(s);
            });

            // Saves json to file
            console.log(json);
            saveJSON(json, 'network_design_project.json');
        }else {
            alert("Canvas is empty");
        }

    });

    // DELETE COMPONENT
    canvasDeleteButton.addEventListener("click", () => {
        allComps.setSelectCompForDelete(true);
    });
};


function preload() {

    compBar = componentsBarTab("Components", 500, 50, new ComponentBarComponents("Components"));
    compBar.init();

    allTabs.setVisableCurrent(compBar);
    allTabs.add(compBar);

    compConnectionBar = componentsBarTab("Connections", 500, 50, new ComponentBarConnections("Connections"));
    compConnectionBar.init();
    allTabs.add(compConnectionBar);


    // Creating button icons for TABS
    button1 = Button('/assets/img/router.svg', 'component image', "Router").init();
    button2 = Button('/assets/img/switch.svg', 'component image', "Switch").init();
    button3 = Button('/assets/img/pc.svg', 'component image', "PC").init();
    button4 = Button('/assets/img/printer.svg', 'component image', "Printer").init();
    button5 = Button('/assets/img/laptop.svg', 'component image', "Laptop").init();
    button6 = Button('/assets/img/smartphone.svg', 'component image', "Smartphone").init();
    button7 = Button('/assets/img/server.svg', 'component image', "Server").init();
    button8 = Button('/assets/img/cloud.svg', 'component image', "Cloud").init();
    button9 = Button('/assets/img/wireless-access-point.svg', 'component image', "Access Point").init();

    button10 = Button('/assets/img/tp-cable.svg', 'Connection Image', 'Twisted Pair').init();
    button11 = Button('/assets/img/coaxial-cable.svg', 'Connection Image', 'Coaxial').init();
    button12 = Button('/assets/img/fibre-cable.svg', 'Connection Image', 'Fibre').init();
    
    // Adding created buttons to TABS
    compBar.getBar().add(button1);
    compBar.getBar().add(button2);
    compBar.getBar().add(button3);
    compBar.getBar().add(button4);
    compBar.getBar().add(button5);
    compBar.getBar().add(button6);
    compBar.getBar().add(button7);
    compBar.getBar().add(button8);
    compBar.getBar().add(button9);
    compConnectionBar.getBar().add(button10);
    compConnectionBar.getBar().add(button11);
    compConnectionBar.getBar().add(button12);

    var validationRules1 = validationRule("Server","Smartphone", false, "Connection is not allowed!");
    var validationRules2 = validationRule("Access Point","Cloud", false, "Connection is not allowed!");
    var validationRules3 = validationRule("Smartphone","Switch", false, "Connection is not allowed!");
    var validationRules4 = validationRule("Laptop","Smartphone", false, "Connection is not allowed!");
    var validationRules5 = validationRule("Access Point","Laptop", false, "Connection is not allowed!");
    var validationRules6 = validationRule("Access Point","Printer", false, "Connection is not allowed!");

    allVRules.add(validationRules1);
    allVRules.add(validationRules2);
    allVRules.add(validationRules3);
    allVRules.add(validationRules4);
    allVRules.add(validationRules5);
    allVRules.add(validationRules6);
}

function setup() {
    frameRate(60);

    canvas = createCanvas((windowWidth-20), windowHeight);
    canvas.parent("canvasDiv");

    compBar.getBar().displayAllButtons();

    networkPropertiesGUI = createGui("Network Properties").setPositionRight(320).setPositionTop(188).lock(true);
    compPropertiesGUI = createGui("NA").disablePin(false).setPosition(1250,500).hide();

}

function draw() {
    clear();
    connectionController.getInstance().drawAllConnections();
    allComps.displayAllComponents();
    updateMouseCursor();

    checkForCopyAndPastEvent();
    checkComponentDeleteEvent();
}


function mousePressed() {
    allComps.setComponent(allComps.getCurrentSelectedComponent(mouseX, mouseY));
    if (allComps.getComponent() != null) {

        
        var multiSelect = checkForMultiSelect();
        if (!allComps.hasClickedSelectedComponent(allComps.getComponent()) && !multiSelect) {
            allComps.clearSelectList();
        }
        if (allComps.isSelectListEmpty()) {
            allComps.addSelectList(allComps.getComponent());
        }
        if (multiSelect) {
            if (!allComps.hasClickedSelectedComponent(allComps.getComponent())) {
                allComps.addSelectList(allComps.getComponent());
            }
        }

        // NEED TO CHANGE HOW THIS WORKS
        print(connectionController.getInstance().isSelectingInterfacePort());
        if (! connectionController.getInstance().isSelectingInterfacePort()) {
            allComps.setSelectedComponent(allComps.getComponent());

            print(allComps.getComponent().getID());

            applyCompValuesToGUI();
            checkComponentDeleteEvent();

            // Checks if users is selecting two components to make a connection
            if (connectionController.getInstance().getDrawConnection()) {
                connectionController.getInstance().selectConnectionForComp(allComps.getComponent());
            }
        }


    }else {
        if (copied == false) {
            allComps.clearSelectList();
        }
    }
}

function mouseMoved() {
    allComps.setComponent(allComps.getCurrentSelectedComponent(mouseX, mouseY));
    if (allComps.getComponent() != null) {
        allComps.setComponentHover(true);
    }else {
        allComps.setComponentHover(false);
    }
    
    if (connectionController.getInstance().getDrawConnection()) {
        connectionController.getInstance().drawConnetions(mouseX, mouseY);
    }
}

function mouseDragged(event) {
    //console.log(event.movementX);
    //console.log(event.movementY);
    if (allComps.getSelectList().length > 1) {
        //console.log("multi move");
        allComps.getSelectList().forEach((c) => {
            c.multiMove(event.movementX, event.movementY);
        });
        allComps.setComponentDrag(true);
    }
    else if (allComps.getComponent() != null) {
        //console.log("default move");
        allComps.getComponent().move(mouseX, mouseY);
        allComps.setComponentDrag(true);
    }
    if (allComps.getDraggingNewComponent()) {
        allComps.getNewlyCreatedComp().move(mouseX, mouseY);
        allComps.setComponentDrag(true);
    }
}

function mouseReleased() {
    if (allComps.getSelectedComponent()) {
        allComps.getSelectedComponent().setIsClicked(false);
    }
    allComps.setDraggingNewComponent(false);
    allComps.setNewlyCreatedComp(null);
    allComps.setComponentDrag(false);
}

function applyNetworkPropertiesToGUI() {
    var hosts = calculateAllHost();
    var subnets = calculateAllSubnets();
    SubnetMask = calculateSubnetMask();
    SupernetMask = calculateSupernetMask(subnets);
    if (typeof networkPropertiesGUI.getGuiParams() == 'undefined') {
        let guiParams = {
            'TotalHosts': hosts.toString(),
            'TotalSubnets': subnets.toString(),
            'SubnetMask': SubnetMask,
            'SupernetMask': SupernetMask,
        }
        networkPropertiesGUI.addObject(guiParams);
    } else {
        networkPropertiesGUI.setValue('TotalSubnets', subnets.toString());
        networkPropertiesGUI.setValue('TotalHosts', hosts.toString());
        networkPropertiesGUI.setValue('SubnetMask', SubnetMask);
        networkPropertiesGUI.setValue('SupernetMask', SupernetMask);
    }
}

function applyGUIValuesToComp() {
    console.log("applying gui params");
    if (guiParams) {
        if (guiParams.HideComponent) {
            allComps.getSelectedComponent().setHideComponent(true);
        } else {
            allComps.getSelectedComponent().setHideComponent(false);
        }
        allComps.getSelectedComponent().setComponentName(guiParams.Name);
        allComps.getSelectedComponent().reSize(guiParams.Width);
        allComps.getSelectedComponent().setTextSize(guiParams.TextSize);
        allComps.getSelectedComponent().setHideConnections(guiParams.HideConnections);
    }
}

function applyCompValuesToGUI() {
    compPropertiesGUI.show();
    if (typeof compPropertiesGUI.getGuiParams() == 'undefined') {
        guiParams = {
            'Name': allComps.getSelectedComponent().getComponentName(),
            'Width': allComps.getSelectedComponent().getWidth(),
            'WidthMin': 65,
            'WidthMax': 200,
            'TextSize': allComps.getSelectedComponent().getTextSize(),
            'TextSizeMax': 32,
            'HideComponent': allComps.getSelectedComponent().getHideComponent(),
            'HideConnections': allComps.getSelectedComponent().getHideConnections(),
            'Lock': false,
            'Connections': allConnections.getInstance().getConnectionsRelatedToComp(allComps.getSelectedComponent()),
            
        };
        compPropertiesGUI.addObject(guiParams);
    } else {
        compPropertiesGUI.setValue('Name', allComps.getSelectedComponent().getComponentName());
        compPropertiesGUI.setValue('Width', allComps.getSelectedComponent().getWidth());
        compPropertiesGUI.setValue('HideComponent', allComps.getSelectedComponent().getHideComponent());
        compPropertiesGUI.setValue('TextSize', allComps.getSelectedComponent().getTextSize());
        compPropertiesGUI.setValue('HideConnections', allComps.getSelectedComponent().getHideConnections());
        compPropertiesGUI.setValue('Connections',  allConnections.getInstance().getConnectionsRelatedToComp(allComps.getSelectedComponent()));
        
    }
    compPropertiesGUI.setTitle(allComps.getSelectedComponent().getComponentName());
}



function updateMouseCursor() {
    if (allComps.getComponentDrag()) {
        document.body.style.cursor = "grabbing";
    }
    else if (connectionController.getInstance().getDrawConnection() || allComps.getSelectCompForDelete()) {
        document.body.style.cursor = "crosshair";
    }
    else if (allComps.getComponentHover()) {
        document.body.style.cursor = "grab";
    }
    else {
        document.body.style.cursor = "default"; 
    }
}

// PROJECT LOADING FUNCTION
function loadComponents(array) {

    // LOADING SAVED SUBNETS
    array.subnets.forEach(s => {
        allSubnets.getInstance().add(s);
    });
    print(allSubnets.getInstance().getAll());
    // LOADING COMPONENTS WITHOUT A CONNECTION
    array.components.forEach((c) => {
        loadImage(c.imgPath, img => {
            var newcomp = createNewComponent(img, c);


            //      TEMP needs to be removed!!!!!!!!!!!!!!!!
            if (newcomp.getType() == "Smartphone") {
                newcomp.setValidLinkningComponents([]);
            }
            else if (newcomp.getType() == "Router") {
                newcomp.addInterface(new Interface("Fast Ethernet", null, null, 4));
                newcomp.addInterface(new Interface("Serial", null, null, 2));
            }
            else if (newcomp.getType() == "Switch") {
                newcomp.addInterface(new Interface("Fast Ethernet", null, null, 12));
            }
            else if (newcomp.getType() == "PC" || newcomp.getType() == "Laptop" || 
                    newcomp.getType() == "printer" || newcomp.getType() == "Server" ||
                    newcomp.getType() == "Access Point") {
                newcomp.addInterface(new Interface("Fast Ethernet", null, null, 1));
            }
            ///////////////////////////////////////

            allComps.add(newcomp);
        });
    });
    // LOADING CONNECTIONS
    array.connections.forEach((con) => {
        // new connection
        var newconnection = Connection();
        newconnection.setType(con.type);
        newconnection.setMousePos(con.mousePos[0], con.mousePos[1]);



        con.interfacePorts.forEach((ip) => {
            var index = con.interfacePorts.indexOf(ip);
            newconnection.addInterfacePort([new Interface(), ip[1]]);
            Object.assign(newconnection.getInterface(index), ip[0]);
        });
        
        // looping through all the components in the connection
        con.components.forEach((c) => {
            
            loadImage(c.imgPath, img => {
                var newcomp = createNewComponent(img, c);
                
                // comp has a connection
                newcomp.setHasConnection(true);

                // add comps interfaces
                newcomp.addInterface(newconnection.getInterface(con.components.indexOf(c)));
                print(newcomp.getInterface(0));
                var exists = false;
                var existingComp;
                if (allComps.get().length > 0) {
                    allComps.get().forEach((comp) => {
                        if (comp.getID() == newcomp.getID()) {
                            exists = true;
                            existingComp = comp;
                        }
                    });
                }
                if (exists == false) {
                    allComps.add(newcomp);
                }
                if (newconnection) {
                    if (exists == true) {
                        newconnection.addComponent(existingComp);
                    }else {
                        newconnection.addComponent(newcomp);
                    }
                }
                print("Loaded File Components");
            });
            
        });

        allConnections.getInstance().add(newconnection);

        window.setTimeout(() => {
            networkPropertiesGUIContainer.dispatchEvent(networkChangeEvent)
        }, 500);
    });
}

function checkForCopyAndPastEvent() {
    if (keyIsDown(17) && keyIsDown(67)) {
        // get the selected component
        
        if (allComps.getSelectedComponent()) {
            $('#copyToastAlert').toast('show');
            $('#copyToastAlert .toast-body').text(
                allComps.getSelectedComponent().getComponentName() + " has been copied."
            );
            copied = true;
            pasted = false;
            console.log("copied"); 
        }
    }
    if (keyIsDown(17) && keyIsDown(88)) {
        // get the selected component
        if (allComps.getSelectedComponent()) {
            $('#cutToastAlert').toast('show');
            $('#cutToastAlert .toast-body').text(
                allComps.getSelectedComponent().getComponentName() + " has been cut."
            );
            cut = true;
            pasted = false;
            console.log("Component is cut"); 
        }
    }
    if (keyIsDown(17) && keyIsDown(86) && pasted == false) {
        console.log(allComps.isSelectListEmpty());
        if (! allComps.isSelectListEmpty()) {
            console.log("multi select paste");
            var list = allComps.getSelectList();
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
                    print("First item");
                    xDifference = 0;
                    yDifference = 0;
                }
                else {
                    print("Middle item");
                    nextCX = list[i].getXpos();
                    nextCY = list[i].getYpos();

                    print("xDifference = ",firstCX-nextCX, firstCX, nextCX);
                    print("yDifference = ",firstCY-nextCY, firstCY, nextCY);

                    xDifference = firstCX - nextCX;
                    yDifference = firstCY - nextCY;
                }

                if (copied) {
                    var clonedComponent = clone(list[i]);
                    clonedComponent.setXpos(mouseX + xDifference);
                    clonedComponent.setYpos(mouseY + yDifference);
                    allComps.add(clonedComponent);
                }
            }
            copied = false;
            pasted = true;
            console.log("paste"); 

            $('#pasteToastAlert').toast('show');
            $('#pasteToastAlert .toast-body').text(
                allComps.getSelectedComponent().getComponentName() + " has been pasted."
            );

            // Triggering networkChangeEvent
            networkPropertiesGUIContainer.dispatchEvent(networkChangeEvent);
        }
        
        if (allComps.getSelectedComponent()) {
            if (copied) {
                var clonedComponent = clone(allComps.getSelectedComponent());
                clonedComponent.setXpos(mouseX);
                clonedComponent.setYpos(mouseY);
                allComps.add(clonedComponent);
                copied = false;
            }
            else if (cut) {
                var comp = allComps.getSelectedComponent();
                comp.setXpos(mouseX);
                comp.setYpos(mouseY);
                cut = false;
            }
            pasted = true;
            console.log("paste"); 

            $('#pasteToastAlert').toast('show');
            $('#pasteToastAlert .toast-body').text(
                allComps.getSelectedComponent().getComponentName() + " has been pasted."
            );

            // Triggering networkChangeEvent
            networkPropertiesGUIContainer.dispatchEvent(networkChangeEvent);
        }
        allComps.clearSelectList();
    }
}
function checkForMultiSelect() {
    if (keyIsDown(17)) {
        return true;
    }else {
        return false;
    }
}

function checkComponentDeleteEvent() {
    // Checks if user has pressed the delete canvas button
    if (allComps.getSelectCompForDelete()) {
        

        if (! allComps.isSelectListEmpty()) {
            console.log("multi select paste");
            var list = allComps.getSelectList();

            list.forEach((c) => {

                allComps.removeComponent(c);


                // get connection
                var connectionsToDel = allConnections.getInstance().getConnectionsRelatedToComp(c);
                connectionsToDel.forEach((con) => {
                allConnections.getInstance().removeConnection(con);
                
                });

            });
            compPropertiesGUI.hide();
        } 
        else if (allComps.getComponent() != null) {
            var comp = allComps.getComponent();
            allComps.removeComponent(comp);


            // get connection
            var connectionsToDel = allConnections.getInstance().getConnectionsRelatedToComp(comp);
            connectionsToDel.forEach((c) => {
                allConnections.getInstance().removeConnection(c);
            });


            $('#deleteToastAlert').toast('show');
            $('#deleteToastAlert .toast-body').text(
                allComps.getSelectedComponent().getComponentName() + " has been deleted."
            );

            compPropertiesGUI.hide();


            // Triggering networkChangeEvent
            networkPropertiesGUIContainer.dispatchEvent(networkChangeEvent);
        }
        allComps.setSelectCompForDelete(false);
    }
}

function clone(obj) {
    let newcomp = Component(obj.getType(), obj.getImgPath(), obj.getImage()).init();
    newcomp.setXpos(obj.getXpos());
    newcomp.setYpos(obj.getYpos());
    newcomp.setWidth(obj.getWidth());
    newcomp.setHeight(obj.getHeight());
    newcomp.setHideComponent(obj.getHideComponent());
    newcomp.setHideConnections(obj.getHideConnections());
    newcomp.setComponentName(obj.getComponentName());
    newcomp.setTextSize(obj.getTextSize());

    newcomp.setComponentName(newcomp.getComponentName() + " - copy");

    //      TEMP needs to be removed!!!!!!!!!!!!!!!!
    if (newcomp.getType() == "Smartphone") {
        newcomp.setValidLinkningComponents([]);
    }
    else if (newcomp.getType() == "Router") {
        newcomp.addInterface(new Interface("Fast Ethernet", null, null, 4));
        newcomp.addInterface(new Interface("Serial", null, null, 2));
    }
    else if (newcomp.getType() == "Switch") {
        newcomp.addInterface(new Interface("Fast Ethernet", null, null, 12));
    }
    else if (newcomp.getType() == "PC" || newcomp.getType() == "Laptop" || 
            newcomp.getType() == "printer" || newcomp.getType() == "Server" ||
            newcomp.getType() == "Access Point") {
        newcomp.addInterface(new Interface("Fast Ethernet", null, null, 1));
    }
    ///////////////////////////////////////


    return newcomp;
}

function createNewComponent(img, c) {
    
    var newcomp = Component(c.type, c.imgPath, img).init();
    newcomp.setID(c.id);
    newcomp.setXpos(c.Xpos);
    newcomp.setYpos(c.Ypos);
    newcomp.setWidth(c.width);
    newcomp.setHeight(c.height);
    newcomp.setHideComponent(c.hideComponent);
    newcomp.setHideConnections(c.hideConnections);
    newcomp.setComponentName(c.componentName);
    newcomp.setType(c.type);
    newcomp.setTextSize(c.textSize);
    return newcomp;
}


// network functions

var hostBits = 0;
function calculateSupernetMask(subnets) {
    // Calculates the Supernet Mask for network,
    // Must have already calculated Subnet Mask to get hostbits.
    
    //var subnets = 16;
    //var x = 2;
    var subnetBits = 1;

    //print("Number of subnets: " + subnets);
    print("hostBits: " +hostBits);

    // calculating the necessary subnet bits needed
    var i=subnetBits+hostBits;
    while (subnets > Math.pow(2, i)) {
        i++;
        subnetBits = i-hostBits;
    }

    print("SubnetBits: " + subnetBits);

    // Total number of bits in an IP address
    var totalBits = 32;

    var slashValue = totalBits - (subnetBits + hostBits);

    // calculates the decimal representation of slash value.
    var decimalNotationOfSupernetmask = calculateDecimalFromSlashValue(slashValue);

    return decimalNotationOfSupernetmask;
}

function calculateSubnetMask() {
    hostBits = 0;
    //var hosts = 16;
    var x = 2;
    
    var hosts = getLargestSubnet();

    // Required hosts bits
    hosts += 1;
    //print("Number of hosts: " + hosts);


    // calculating the necessary host bits needed, includes id and broadcast addresses
    var i=0;
    while (hosts > Math.pow(2, i)-2) {
        //print(Math.pow(2, i));
        i++;
        hostBits = i;
    }

    //print("Number of possible IP addresses: " + (Math.pow(2, hostBits)-2));
    //print("host bit required: " + hostBits);
    //print("Total number of host ip addresses + id and broadcast addresses: " + Math.pow(x, hostBits));
    
    // Total number of bits in an IP address
    var totalBits = 32;
    // Calculation for slashValue
    var slashValue = totalBits - hostBits;

    //print("slashValue: " + slashValue);

    // Calculate the subnet mask representation in decimal notation.
    var decimalNotationOfSubnetmask = calculateDecimalFromSlashValue(slashValue);

    return decimalNotationOfSubnetmask;
}

function calculateDecimalFromSlashValue(slashValue) {
    // Can be used to calculate the Supernet or Subnet Mask dotted decimal notation.
    var bits=0;
    var decimalNotation = "";
    for (var i=0; i <= slashValue; i++) {
        if (bits == 8) {
            decimalNotation += "255."
            bits=0;
        } 
        else if (i==slashValue) {
            var mask = 0;
            var addedBits = 0;
            for (var l=7;l>7-bits;) {
                mask += Math.pow(2, l);
                //print(Math.pow(2, l));
                l--;
            }
            //print("addedbits: " + addedBits);
            mask -= addedBits;
            decimalNotation += "" + mask + ".";
        }
        bits++;
    }

    // Adding trailing 0's at end of subnet mask if it is less than /24
    var numberOfOctets = decimalNotation.split(".").length -1;
    //print("numberOfOctets: " + numberOfOctets);
    for (var i=0; i < 4 - numberOfOctets; i++) {
        if (i+1 == 4 - numberOfOctets) {
            decimalNotation += "0";
        } else {
            decimalNotation += "0.";
        }
    }

    // Remove any additional periods
    if (numberOfOctets > 3) {
        decimalNotation = decimalNotation.slice(0, -1);
    }

    return decimalNotation;
}

// Calculates all the host devices currently displayed on canvas
function calculateAllHost() {
    var totalNumberOfHosts = 0;
    allComps.get().forEach((comp) => {
        if (allComps.isEndDevice(comp)) {
            totalNumberOfHosts += 1;
        }
    });
    return totalNumberOfHosts;
}

// Calculates number of subnets currently on canvas
function calculateAllSubnets() {
    var totalNumberOfSubnets = 0;
    var connections = [];
    
    allComps.get().forEach((comp) => {
        //print(comp.getComponentName());
        //print(allConnections.getInstance().getConnectionsRelatedToComp(comp));
        if (comp.getType() == "Router") {
            //print("found router");
            allConnections.getInstance().getConnectionsRelatedToComp(comp).forEach((con) => {
                connections.push(con);
            });
        }
    });
    //print(connections);
    if (connections != null) {
        connections = connections.filter((connections, index, self) =>
            index === self.findIndex((c) => (
                c.getComponent(0).getID() === connections.getComponent(0).getID() &&
                c.getComponent(1).getID() === connections.getComponent(1).getID()
            ))
        );
        totalNumberOfSubnets += connections.length;
    }
    return totalNumberOfSubnets;
}

var largestSubnet = 0;
var numberOfEndDevices = 0;
var previousComp = null;
var currentRouter = null;

var numberOfConnections = 0;
var traveledConnections = [];
var previousConnection = null;

var currSubnet;

function getLargestSubnet() {
    var allRouters = [];
    traveledConnections = [];
    largestSubnet = 0;

    allComps.get().forEach((comp) => {
        if (comp.getType() == "Router") {
            allRouters.push(comp);
        }
    });

    allRouters.forEach((r) => {
        var routerConnections = allConnections.getInstance().getConnectionsRelatedToComp(r);

        currentRouter = r;
        previousComp = r;
        routerConnections.forEach((c) => {

            // reset counter for hosts per subnet
            numberOfEndDevices = 0;
            
            // comp should not equal a router
            var comp = null;
            if (c.getComponent(0).getType() != "Router") {
                comp = c.getComponent(0);
            }
            else if (c.getComponent(1).getType() != "Router") {
                comp = c.getComponent(1);
            }
            
            if (comp != null) {
                //print("name: " + comp.getComponentName());

                // Check if subnet already exists
                var foundSubnet = allSubnets.getInstance().toList().find(x => x.gatewayRouterID == r.getID() && x.connection == c);
                if (foundSubnet == null) {
                    currSubnet = new Subnet();
                    currSubnet.gatewayRouterID = r.getID();
                    currSubnet.connection = c;
                    allSubnets.getInstance().add(currSubnet);
                    //print("---new subnet created---");
                    //print("new subnet ", currSubnet);
                }
                else {
                    //print("---found previous subnet created---");

                    currSubnet = foundSubnet;
                    currSubnet.gatewayRouterID = r.getID();
                    currSubnet.connection = c;
                }


                travelSubnetTree(comp, comp);
            }
        });
    });

    //print("largest Subnet: " +largestSubnet);

    return largestSubnet;
}


function travelSubnetTree(currentComp, rootComp) {
    
    // check if all connections have been iterated through
    var connections = allConnections.getInstance().getConnectionsRelatedToComp(currentComp);
    numberOfConnections = connections.length;
    var currentConnection = null;

    //print("current comp: "+currentComp.getComponentName());
    //traveledConnections.forEach((c) => {
        //print("Traveled connections: "+c.getComponent(0).getComponentName() + " - " + c.getComponent(1).getComponentName());
    //});
    //print("numberOfEndDevices: "+numberOfEndDevices)

    connections.forEach((c) => {
        //print("----");
        //print("checking connection: "+c.getComponent(0).getComponentName() + " - " +c.getComponent(1).getComponentName());
        //print(hasBeenTraveled(c), isPreviousRoute(c));
        if (! hasBeenTraveled(c) && !isPreviousRoute(c)) {
            //print("valid")
            currentConnection = c;
        }
    });

    //print("ids: ", previousComp.getID(), currentRouter.getID());
    //print(previousConnection.getComponent(0).getComponentName(),previousConnection.getComponent(1).getComponentName());
    //print(currentConnection, hasBeenTraveled(previousConnection));
    if (currentConnection == null && hasBeenTraveled(previousConnection)) {
        //print("finished");
        if (largestSubnet < numberOfEndDevices) {
            largestSubnet = numberOfEndDevices;
        }
        return;
    } else {
        // Checking for next connection
        findAllEndDevices(currentComp, rootComp);
    }
    
}

function findAllEndDevices(currentComp, rootComp) {
    var connections = allConnections.getInstance().getConnectionsRelatedToComp(currentComp);
    var numberOfConnections = connections.length;

    var currentConnection = null;
    //print("--- finding all end devies ---");
    connections.forEach((c) => {
        //print("----");
        //print("checking connection: "+c.getComponent(0).getComponentName() + " - " +c.getComponent(1).getComponentName());
        if (! hasBeenTraveled(c) && !isPreviousRoute(c)) {
            //print("valid");
            currentConnection = c;
        }
    });
    // checks if there are any end devices.
    var nextComp = null;
    if (currentConnection == null && previousConnection != null) {
        //print("all end devices found");
        traveledConnections.push(previousConnection);
        previousComp = currentRouter;
        travelSubnetTree(rootComp, rootComp);
    } else {
        if (currentConnection.getComponent(0).getID() != currentComp.getID()) {
            nextComp = currentConnection.getComponent(0);
        } else {
            nextComp = currentConnection.getComponent(1);
        }
    }

    //print("nextComp: "+nextComp.getComponentName());
    if (nextComp) {
        if (allComps.isEndDevice(nextComp)) {
            numberOfEndDevices++;
            traveledConnections.push(currentConnection);
            previousComp = currentRouter;

            // ADDING END DEVICE TO SUBNET

            // CHECK IF DEVICE ALREADY EXISTS IN SUBNET
            allSubnets.getInstance().toList().forEach(s => {
                if (! s.endDevices.find(d => d == nextComp.getID())) {
                    if (currSubnet != null) {
                        //print(currSubnet);
                        //print(nextComp.getID());
                        currSubnet.add(nextComp.getID());
                    }
                }
            });
            

            travelSubnetTree(rootComp, rootComp);
        
        } else {
            previousComp = currentComp;
            travelSubnetTree(nextComp, rootComp);
        }
    }
}   

function hasBeenTraveled(connection) {
    var hasBeenTraveled = false;
    if (traveledConnections.length != 0) {
        traveledConnections.forEach((c) => {
            if (c === connection) {
                hasBeenTraveled = true;
            }
        });
    }
    return hasBeenTraveled;
}

function isPreviousRoute(connection) {
    var isPreviousRoute = false;
    //print("previous route check: "+connection.getComponent(0).getID(), connection.getComponent(1).getID(), previousComp.getID());
    if (connection.getComponent(0).getID() === previousComp.getID() || connection.getComponent(1).getID() === previousComp.getID()) {
        previousConnection = connection;
        isPreviousRoute = true;
    }
    return isPreviousRoute;
}






function calculateSubnets(comp) {
    if (allComps.getComponent().getType() == "Router" && comp == null) {
        var routerConnections = allConnections.getInstance().getConnectionsRelatedToComp(subnetRouter);

        numberOfSubnetsForComponent = routerConnections.length;
    } else {
        if (comp == null) {
            var connections = allConnections.getInstance().getConnectionsRelatedToComp(allComps.getComponent());
        } else {
            var connections = allConnections.getInstance().getConnectionsRelatedToComp(comp);
        }   
        // check for router or switch connection
        var check = searchForConnectionToRouter(connections);

        var subnetRouter = check[0];
        var Switch = check[1];

        if (subnetRouter != null) {
            var routerConnections = allConnections.getInstance().getConnectionsRelatedToComp(subnetRouter);
            numberOfSubnetsForComponent = routerConnections.length;
        } else {
            numberOfSubnetsForComponent = 0;
            if (Switch != null) {
                calculateSubnets(Switch)
            }
        }
    }

}


function binaryToDecimal(IPaddress) {
    var decimalRepresentation = "";
    IPaddress.split(".").forEach(octet => {
        decimalRepresentation += parseInt(octet, 2)+".";
    });
    decimalRepresentation = decimalRepresentation.slice(0, -1);
    return decimalRepresentation;
}

function decimalToBinary(IPaddress) {
    // converting to binary representation
    
    var binary = "";

    IPaddress.split(".").forEach(octet => {
        var conversionToBinary = (parseInt(octet) >>> 0).toString(2);
        while (conversionToBinary.length < 8) {
            conversionToBinary = "0" + conversionToBinary;
        }
        binary += conversionToBinary + ".";
    });

    // Remove trailing "."
    binary = binary.slice(0, -1);
    return binary;
}

function calculateSubnetID(IPaddress, SubnetMask) {
    var IPBinary = decimalToBinary(IPaddress);
    var SubnetMaskBinary = decimalToBinary(SubnetMask);

    print(IPBinary);
    print(SubnetMaskBinary);
    print("---------------------------");
    
    var ANDresult = "";
    for (var i=0; i<4; i++) {
        var IPoctect = IPBinary.split(".")[i];
        var SubnetMaskoctect = SubnetMaskBinary.split(".")[i];

        for (var l=0;l<8;l++) {
            ANDresult += (parseInt(IPoctect.charAt(l), 2) & parseInt(SubnetMaskoctect.charAt(l), 2)).toString();
        }
    }

    print(ANDresult);

    var subnetIDBinary = "";

    for (var i=0; i<ANDresult.length;i+=8) {
        var octet = ANDresult.substring(i,i+8);
        subnetIDBinary += octet+".";
    }
    subnetIDBinary = subnetIDBinary.slice(0, -1);
    print(subnetIDBinary);

    var subnetIDDecimal = binaryToDecimal(subnetIDBinary);
    return subnetIDDecimal;
}







// OLD NOT USED!!!!
function searchForConnectionToRouter(connections) {
    var subnetRouter = null;
    var Switch = null;
    
    connections.forEach((c) => {
        if (c.getComponent(0).getType() == "Router") {
            subnetRouter = c.getComponent(0);
        }
        else if (c.getComponent(1).getType() == "Router") {
            subnetRouter = c.getComponent(1);
        } else {
            if (c.getComponent(0).getType() == "Switch") {
                Switch = c.getComponent(0);
            }
            else if (c.getComponent(1).getType() == "Switch") {
                Switch = c.getComponent(1);
            }
        }
    });
    return [subnetRouter, Switch];
}


// dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas((windowWidth-20), windowHeight);
}

