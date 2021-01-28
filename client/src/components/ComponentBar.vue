<template>
    <div id="components-container" class="">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <ul id="navbar-component-links" class="navbar-nav mr-auto">
                <li class="nav-item active"><a class="nav-link" data-toggle="collapse" href=".component-list" role="button" aria-expanded="false" aria-controls="componentList linkingComponentList">Components</a></li>
                <li class="nav-item active"><a class="nav-link" data-toggle="collapse" href=".component-list" role="button" aria-expanded="false" aria-controls="componentList linkingComponentList">Connections</a></li>
            </ul>
        </nav>
        <div id="rightSidePanel"></div>
        <div class="collapse component-list show shadow" id="componentList">
            <nav id="componentsNav" class="navbar navbar-expand-lg">
                <li class="d-inline-block">
                    <img @mousedown="createNewComponent" alt="PC icon" src="@/assets/img/pc.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img @mousedown="createNewComponent" alt="Laptop icon" src="@/assets/img/laptop.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img @mousedown="createNewComponent" alt="Smart Phone icon" src="@/assets/img/smartphone.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img @mousedown="createNewComponent" alt="Printer icon" src="@/assets/img/printer.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img @mousedown="createNewComponent" alt="Server icon" src="@/assets/img/server.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img @mousedown="createNewComponent" alt="Switch icon" src="@/assets/img/switch.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img @mousedown="createNewComponent" alt="Router icon" src="@/assets/img/router.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img @mousedown="createNewComponent" alt="Cloud icon" src="@/assets/img/cloud.svg" class="componentImg" draggable="false">
                </li>
                <li class="d-inline-block">
                    <img @mousedown="createNewComponent" alt="Wireless Access Point icon" src="@/assets/img/wireless-access-point.svg" class="componentImg" draggable="false">
                </li>
               
            </nav>
        </div>
        <div class="collapse component-list shadow" id="linkingComponentList">
            <li class="d-inline-block">
                <img @mousedown="createNewLinkingComponent" alt="" src="@/assets/img/twisted-pair-cable.svg" class="componentImg" draggable="false">
            </li>
            <li class="d-inline-block">
                <img @mousedown="createNewLinkingComponent" alt="" src="@/assets/img/fibre-cable.svg" class="componentImg" draggable="false">
            </li>
            <li class="d-inline-block">
                <img @mousedown="createNewLinkingComponent" alt="" src="@/assets/img/coaxial-cable.svg" class="componentImg" draggable="false">
            </li>
        </div>
    </div>
</template>

<script>
    // Controller
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
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>