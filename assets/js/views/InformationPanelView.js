class InformationPanelView {
    constructor(panel) {
        this.container = createDiv();
        this.panel = panel;

    }
    show() {
        print("show");
        this.container.style('visibility', "visable");
    }
    hide() {
        print("hide");
        this.container.style('visibility', "hidden");
    }
    create() {
        this.container.id(this.panel.title);

        this.container.style("width", this.panel.width);
        this.container.style("height", this.panel.height);


        return this;
    }
    createTable() {

    }
    displayDatGUI() {

    }
    
    collapse() {
        this.mainContainer.style("width", this.panel.width);
        this.mainContainer.style("height", "30px");
    }
    extend() {
        this.mainContainer.style("width", this.panel.width);
        this.mainContainer.style("height", this.panel.height);
    }
    clear() {
        this.contentContainer.html('');
    }
}
