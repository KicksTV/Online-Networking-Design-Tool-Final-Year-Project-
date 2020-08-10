export default class InterfaceView {
    constructor(interfaces) {
        this.container = createDiv();
        this.title = "Interfaces";
        this.interfaces = interfaces;


        var titleContainer = createDiv(this.title);
        titleContainer.id('interfaceTitleContainer');
        titleContainer.parent(this.container);



        // applying styles
        this.container.id('interfaceContainer');
        this.container.parent("canvasDiv");
    }
    show(x, y) {
        console.log("showing");
        console.log(x, y);
        var xPos = x +30;
        this.container.style('left', xPos + "px");
        this.container.style('top', y + "px");

        this.container.style('visibility', "visable");
    }
    hide() {
        this.container.style('visibility', "hidden");
        //this.container.style('display', 'none');
        console.log("hide");
    }
    create() {
        this.interfaces.forEach(i => {
            var div = createDiv(i.name);
            div.parent(this.container);
            div.class('interfaceTitleContainer');
            for (var p=0; p<i.availablePorts;p++) {
                var button = createButton(i.name + " " + p, i.name + " " + p);
                //print("Port" + i.portAvailability[p]);
                
                button.class('portButton');

                
                if (i.portAvailability[p] == false) {
                    //print("disable button");
                    button.attribute('disabled', true);
                    button.addClass('disabledPortButton');
                }
                button.parent(this.container);
            }

            div.id('portContainer');
        });

        var cancelButton = createButton("Cancel", "Cancel");

        cancelButton.id('connectionCancel');
        cancelButton.parent(this.container);
        
        return this;
    }
    clear() {
        this.container.html('');
    }
}
