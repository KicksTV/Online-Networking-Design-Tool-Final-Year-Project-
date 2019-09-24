class componentsBarLabel {
    constructor(title, width, height) {
        this.buttons = [];
        this.title = title;
        this.width = width;
        this.height = height;
        this.current = false;
        this.li = createElement('li', '');;
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
        
        // for (let i=0; i < this.buttons.length; i++) {
            
        //     // CREATES DIV AND IMAGE 
            
        //     var div = createDiv();
        //     var compImg = createImg(this.buttons[i].imgPath, this.buttons[i].imgAlt);
    
        //     // APPLIES CSS TO DIV CONTAINING ALL COMPONENTS

        //     div.addClass('compDiv');
        //     div.parent('components');
            
        //     // APPLIES CSS TO IMG AND ADDS IT TO DIV CONTAINER

        //     compImg.addClass('componentImg');
        //     compImg.parent(div);

        //     // CREATES A NEW COMPONENT

        //     compImg.mouseClicked(function () {
                
        //         // CREATES NEW COMPUTER

        //         let newcomp = new Computer();

        //         // ADDS IT TO ARRAY OF ALL COMPUTERS

        //         allComputers.push(newcomp);
        //     });
        // }
        
    }
    setCurrent(curr) {
        this.current = curr;
        
        this.li.addClass('active');
    }
}