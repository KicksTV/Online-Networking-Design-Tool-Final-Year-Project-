<template>
    <div id="components-container" class="">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <ul id="navbar-component-links" class="navbar-nav mr-auto">
                <li class="nav-item active"><b v-b-toggle.componentList.linkingComponentList class="nav-link">Components</b></li>
                <li class="nav-item active"><b v-b-toggle.linkingComponentList.componentList class="nav-link">Connections</b></li>
            </ul>
        </nav>
        <div id="rightSidePanel"></div>
        <b-collapse visible  class="shadow" id="componentList">
            <nav id="componentsNav" class="navbar navbar-expand-lg">
                <li class="d-inline-block">
                    <img id="pcIcon" @mousedown="createNewComponent" alt="PC icon" src="@/assets/img/pc.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img id="laptopIcon" @mousedown="createNewComponent" alt="Laptop icon" src="@/assets/img/laptop.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img id="spIcon" @mousedown="createNewComponent" alt="Smart Phone icon" src="@/assets/img/smartphone.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img id="printerIcon" @mousedown="createNewComponent" alt="Printer icon" src="@/assets/img/printer.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img id="serverIcon" @mousedown="createNewComponent" alt="Server icon" src="@/assets/img/server.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img id="switchIcon" @mousedown="createNewComponent" alt="Switch icon" src="@/assets/img/switch.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img id="routerIcon" @mousedown="createNewComponent" alt="Router icon" src="@/assets/img/router.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img id="cloudIcon" @mousedown="createNewComponent" alt="Cloud icon" src="@/assets/img/cloud.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img id="apIcon" @mousedown="createNewComponent" alt="Wireless Access Point icon" src="@/assets/img/wireless-access-point.svg" class="componentImg" draggable="false">
                </li>
               
            </nav>
        </b-collapse>
        <b-collapse class="shadow" id="linkingComponentList">
            <nav id="componentsNav" class="navbar navbar-expand-lg">
                <li class="d-inline-block">
                    <img id="tpIcon" @mousedown="createNewLinkingComponent" alt="" src="@/assets/img/twisted-pair-cable.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img id="fibreIcon" @mousedown="createNewLinkingComponent" alt="" src="@/assets/img/fibre-cable.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img id="coaxialIcon" @mousedown="createNewLinkingComponent" alt="" src="@/assets/img/coaxial-cable.svg" class="componentImg" draggable="false">
                </li>
            </nav>
        </b-collapse>
        <b-tooltip target="pcIcon" placement="bottom">
            Personal Computer
        </b-tooltip>
        <b-tooltip target="laptopIcon" placement="bottom">
            Laptop
        </b-tooltip>
        <b-tooltip target="spIcon" placement="bottom">
            Smartphone
        </b-tooltip>
        <b-tooltip target="printerIcon" placement="bottom">
            Printer
        </b-tooltip>
        <b-tooltip target="serverIcon" placement="bottom">
            Server
        </b-tooltip>
        <b-tooltip target="switchIcon" placement="bottom">
            Switch
        </b-tooltip>
        <b-tooltip target="routerIcon" placement="bottom">
            Router
        </b-tooltip>
        <b-tooltip target="cloudIcon" placement="bottom">
            Cloud
        </b-tooltip>
        <b-tooltip target="apIcon" placement="bottom">
            Access Point
        </b-tooltip>
        <b-tooltip target="tpIcon" placement="bottom">
            Twisted Pair Cable
        </b-tooltip>
        <b-tooltip target="fibreIcon" placement="bottom">
            Fibre Cable
        </b-tooltip>
        <b-tooltip target="coaxialIcon" placement="bottom">
            Coaxial Cable
        </b-tooltip>
    </div>
</template>

<script>
    // Controller
    import p5Controller from '@/assets/js/controller/p5Controller.js';
    import componentController from '@/assets/js/controller/componentController.js';
    import connectionController from '@/assets/js/controller/connectionController.js';
    import ioController from '@/assets/js/controller/ioController.js';
    import networkController from '@/assets/js/controller/networkController.js';

    // Collections
    import allComponents from '@/assets/js/collections/allComponents.js';
    import allConnections from '@/assets/js/collections/allConnections.js';


    // Models
    import Graph from '@/assets/js/models/graph.js';

    export default {
        name: "ComponentBar",
        props: {

        },
        methods: {
            createNewComponent: async (e) => {
                var src = e.target.src;
                var name = src.match(/\/\w+\./)[0].match(/\w+/)[0];

                let defaultComponent = await componentController.createNewComponent(name);
                componentController.setSelectedComponent(defaultComponent);
                componentController.setDraggingNewComponent(true);
                ioController.sendData('createComponent', defaultComponent.prepareForJson());
                // ADDS IT TO ARRAY OF ALL components
                allComponents.add(defaultComponent);
                // Adds component to graph
                Graph.getInstance().addNode(defaultComponent.id);
                networkController.dispatchNetworkChangeEvent()
            },
            createNewLinkingComponent: async (e) => {
                var src = e.target.src;
                var name = src.match(/\/\w+-cable\.|\/\w+-\w+-cable\./)[0].match(/\w+-\w+/)[0];
                let c = await connectionController.createNewConnection(name);
                connectionController.setDrawConnection(true);
                allConnections.setSelectedConnection(c);

                p5Controller.setMousePressedEvent(connectionController.connectionEvent)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.componentImg {
    -moz-user-select: none; 
    -webkit-user-select: none; 
    -ms-user-select:none; 
    user-select:none;
    -o-user-select:none;
}
.nav-link {
    -moz-user-select: none; 
    -webkit-user-select: none; 
    -ms-user-select:none; 
    user-select:none;
    -o-user-select:none;
}
.nav-link:focus {
    outline: none;
}
</style>