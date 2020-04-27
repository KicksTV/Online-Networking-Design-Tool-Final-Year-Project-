class PanelView {
    constructor() {
        this.mainContainer = document.getElementById("bottomPanel");
        this.titleContainer = document.getElementById("bottomPanelTitleContainer");
        this.contentContainer = document.getElementById("bottomPanelContentContainer");
        this.table = document.getElementById("connections-table");

        this.addEvents();
    }
    show() {
        print("show");
        this.contentContainer.style.visibility = "visable";
    }
    hide() {
        print("hide");
        this.contentContainer.style.visibility = "hidden";
    }
    addEvents() {

        // ADDING EVENT LISTENERS
        this.mainContainer.addEventListener('mouseenter', () => {
            this.extend();
        });
        this.mainContainer.addEventListener('mouseleave', () => {
            this.collapse();
        });

        return this;
    }
    update(dataArray) {
        this.clear();
        this.addDataToTable(dataArray);
    }
    collapse() {
        this.mainContainer.style.width = "100%";
        this.mainContainer.style.height = "30px";
    }
    extend() {
        this.mainContainer.style.width = "100%";
        this.mainContainer.style.height = "300px";
    }
    addDataToTable(dataArray) {

        if (dataArray.length > 0) {
            dataArray.forEach(data => {


                var tr = document.createElement("tr");

                // Table body                
                this.table.children[1].appendChild(tr);

                var allCol = [];
                for (var i=0;i<6;i++) {
                    var td = document.createElement("td");
                    tr.appendChild(td);
                    allCol.push(td);
                }
                allCol[0].setAttribute("scope", "row");

                allCol[0].innerHTML = dataArray.indexOf(data)+1;
                allCol[1].innerHTML = data.getComponent(0).name;
                allCol[2].innerHTML = "→";
                allCol[3].innerHTML = data.getComponent(1).name;
                allCol[4].innerHTML = data.getType();
                allCol[5].innerHTML = "";

            });
        } else {
            // Clearing Table body
            var tr = document.createElement("tr");
            this.table.children[1].appendChild(tr);

            var td = document.createElement("td");
            tr.appendChild(td);
            tr.innerHTML = "No Connections";
        }
    }
    clear() {
        // Clearing Table body
        this.table.children[1].innerHTML = '';
    }
}
