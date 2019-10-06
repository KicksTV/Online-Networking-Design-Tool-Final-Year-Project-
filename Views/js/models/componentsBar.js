class componentsBarLabel {
    constructor(title, width, height) {
        this.buttons = [];
        this.title = title;
        this.width = width;
        this.height = height;
        this.current = false;

        // CREATING NEW HTML ELEMENTS
        this.li = createElement('li', '');
        this.a = createA('', this.title);
    }
    display() {
        this.li.addClass('nav-item');
        this.a.addClass('nav-link');

        this.li.parent('navbar-component-links');
        this.a.parent(this.li);
    }
    addButton(btn) {
        this.buttons.add(btn);
    }
    displayAllButtons() {
        
        // LOOPS THROUGH ALL BUTTONS AND DISPLAY's EACH ONE
        
        for (let i=0; i < this.buttons.length; i++) {

            this.buttons[i].display();

            // ADDS BUTTON ELEMENT TO NAVBAR

            this.buttons[i].li.parent('navbar-component');
            

            // CREATES A NEW COMPONENT

            this.buttons[i].img.mouseClicked(() => {
                
                let newcomp;

                // CREATES NEW COMPUTER

                if (this.buttons[i].componentType == "pc") {
                    newcomp = Computer();
                }
                else if (this.buttons[i].componentType == "switch") {
                    newcomp = Switch();
                }
                else if (this.buttons[i].componentType == "router") {
                    newcomp = Router();
                }

                // ADDS IT TO ARRAY OF ALL COMPUTERS

                allComputers.push(newcomp);
            });
        }
        
    }
    setCurrent(curr) {
        this.current = curr;
        
        this.li.addClass('active');
    }
}