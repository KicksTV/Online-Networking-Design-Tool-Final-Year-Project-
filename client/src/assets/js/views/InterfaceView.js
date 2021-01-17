const p5 = require('p5')

export default class InterfaceView {
    constructor(interfaces) {
        this.container = p5.createDiv();
        this.title = "Interfaces";
        this.interfaces = interfaces;


        var titleContainer = p5.createDiv(this.title);
        titleContainer.id('interfaceTitleContainer');
        titleContainer.parent(this.container);



        // applying styles
        this.container.id('interfaceContainer');
        this.container.parent("canvasDiv");
    }
    show(x, y) {
        // console.log("showing");
        console.log(x, y);
        var xPos = x +30;
        this.container.style('left', xPos + "px");
        this.container.style('top', y + "px");

        this.container.style('visibility', "visable");
    }
    hide() {
        // console.log("hide");
        this.container.style('visibility', "hidden");
        //this.container.style('display', 'none');
    }
    create() {
        this.interfaces.forEach(i => {
            var div = p5.createDiv(i.name);
            div.parent(this.container);
            div.class('interfaceTitleContainer');
            for (var p=0; p<i.availablePorts;p++) {
                var button = p5.createButton(i.name + " " + p, i.name + " " + p);
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

        var cancelButton = p5.createButton("Cancel", "Cancel");

        cancelButton.id('connectionCancel');
        cancelButton.parent(this.container);
        
        return this;
    }
    clear() {
        this.container.html('');
    }
}
