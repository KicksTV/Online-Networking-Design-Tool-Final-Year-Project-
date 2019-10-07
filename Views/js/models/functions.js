const clicker = (state) => ({
    clicked() {
        var d = dist(state.Xpos, state.Ypos, mouseX, mouseY);
        if (d < state.componentSize) {
            state.isClicked = true;
        }else {
            state.isClicked = false;
        }
        return state.isClicked;
    }

});

const componentDisplayer = (state) => ({
    display() {
        image(state.imgPath, state.Xpos, state.Ypos, state.componentSize, state.height);
        textSize(state.textSize);
        text(state.componentName, state.imgXpos, state.imgYpos + state.componentSize + 5, state.componentSize, 30);
        textAlign(CENTER, CENTER);
    }
});

const mover = (state) => ({
    move(x, y) {
        clear();
        x = x - (state.componentSize/2);
        y = y - (state.componentSize/2);
        redraw();
        state.Xpos = x;
        state.Ypos = y;
    }
});

const prepareForJson = (state) => ({
    prepareForJson() {
        let parms = {
            "Xpos": state.Xpos,
            "Ypos": state.Ypos,
            "componentSize": state.componentSize,
            "hideComponent": state.hideComponent
        }
        return parms;
    }
});

const buttonDisplayer = (state) => ({
    display() {
        let li = createElement('li', '');
        let img = createImg(state.imgPath, state.imgAlt);
        
        img.addClass('componentImg');
        img.parent(li);

        state.li = li;
        state.img = img;
    }
});

const compLabelDisplay = (state) => ({
    display() {
        state.li.addClass('nav-item');
        state.a.addClass('nav-link');

        state.li.parent('navbar-component-links');
        state.a.parent(state.li);
    },
    displayAllButtons() {
    
        // LOOPS THROUGH ALL BUTTONS AND DISPLAY's EACH ONE
        
        for (let i=0; i < state.buttons.length; i++) {
    
            state.buttons[i].display();
    
            // ADDS BUTTON ELEMENT TO NAVBAR
    
            state.buttons[i].li.parent('navbar-component');
            
    
            // CREATES A NEW COMPONENT
    
            state.buttons[i].img.mouseClicked(() => {
                
                let newcomp;
    
                // CREATES NEW COMPUTER
    
                if (state.buttons[i].componentType == "pc") {
                    newcomp = Computer();
                }
                else if (state.buttons[i].componentType == "switch") {
                    newcomp = Switch();
                }
                else if (state.buttons[i].componentType == "router") {
                    newcomp = Router();
                }
    
                // ADDS IT TO ARRAY OF ALL COMPUTERS
    
                allComponents.push(newcomp);
            });
        }
        
    }
});

// addButton(btn) {
//     this.buttons.add(btn);
// }

const canBeCurrent = (state) => ({
    setCurrent(curr) {
        thstateis.current = curr;
        
        state.li.addClass('active');
    }
});
