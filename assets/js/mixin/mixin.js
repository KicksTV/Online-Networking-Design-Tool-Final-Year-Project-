
// Components Bar Component and Connection Mixin 
const compBarGetSetMixin = superclass => class extends superclass {
    init() {
        print(this.title);
        this.ul.addClass('navbar-nav mr-auto');
        this.ul.id(`${this.title}navbar-component`);
        this.ul.parent('componentsNav');
    }
    getTitle() {
        return this.title;
    }
    setTitle(t) {
        this.title = t;
    }
    getButtons(){
        return this.buttons;
    }
    getUL() {
        return this.ul;
    }
    add(b) {
        this.buttons.push(b);
    }
};