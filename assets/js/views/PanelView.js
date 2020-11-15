//Controllers
import componentController from '../controller/componentController.js';
import networkController from '../controller/networkController.js';

export default class PanelView {
    constructor() {
        this.mainContainer = document.getElementById("bottomPanel");
        this.titleContainer = document.getElementById("bottomPanelTitleContainer");
        this.contentContainer = document.getElementById("bottomPanelContentContainer");
        this.table = document.getElementById("connections-table");

        this.addEvents();
    }
    show() {
        console.log("show");
        this.contentContainer.style.visibility = "visable";
    }
    hide() {
        console.log("hide");
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

                var currentSelectedComp = componentController.getSelectedComponent();
                var ConComponents = data._components;
                var interfaces = data._interfacePorts;
                var selectedCompInterface;
                var selectedCompInterfacePort;

                var con_index = dataArray.indexOf(data);

                // index that the current selected comp is found in connection
                var index = 0;

                for (let compindex in ConComponents) {
                    if (ConComponents[compindex] == currentSelectedComp) {
                        index = compindex;
                    }
                }

                selectedCompInterface = interfaces[index][0];
                selectedCompInterfacePort = interfaces[index][1];

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

                allCol[0].innerText = dataArray.indexOf(data)+1;
                allCol[1].innerText = data.getComponent(0).name;
                allCol[2].innerText = "→";
                allCol[3].innerText = data.getComponent(1).name;
                allCol[4].innerText = data.getType();

                var ipfield = allCol[5];

                ipfield.id = `IP_address_field_${con_index}`;

                var $IP_field = $(`#${ipfield.id}`);

                if (componentController.isEndDevice(currentSelectedComp) || currentSelectedComp.name == "Router") {
                    if (selectedCompInterface.portIPaddress[selectedCompInterfacePort]) {
                        ipfield.innerText = selectedCompInterface.portIPaddress[selectedCompInterfacePort];
                    }
                    ipfield.setAttribute("contenteditable", "true");

                    $IP_field.on('keypress', (e) => {
                        networkController.checkIPAddressInput(e, data);
                    });
                }

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