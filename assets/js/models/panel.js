class Panel {
    constructor(title, width, height, pos) {
        this.title = title;
        this.position = pos;
        this.width = width;
        this.height = height;
        this.collapsed = false;
        this.locked = false;

    }
}

class positionPanel extends panelMixin(Panel) {
    constructor(title, width, height, pos) {
        super(title, width, height, pos);
        this.informationPanelTitles = [];
        this.informationPanels = [];
    }
    addInformationPanel(infoPanel) {
    }
}

class InformationPanel extends panelMixin(Panel) {
    constructor(title, width, height, pos) {
        super(title, width, height, pos);
        this.datGUI;
        this.guiData;

    }
}