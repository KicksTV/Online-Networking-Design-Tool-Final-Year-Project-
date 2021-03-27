<template>
  <div>
    <div id="canvasContainer" class="">
        <div id="canvasRow" class="">
            <div class="canvasButtonContainer">
                <span id="canvasLoadProject" style="margin-left: 15px" class="canvasButton fas fa-file-upload fa-lg" data-toggle="tooltip" data-placement="bottom" title="Load Project"></span>
                <input id="upload_input" type="file" name="project_upload" class="upload_input" />
                <span id="canvasSaveProject" class="canvasButton fas fa-save fa-lg" data-toggle="tooltip" data-placement="bottom" title="Save Project"></span>
                <span id="canvasDeleteButton" class="canvasButton fas fa-trash-alt fa-lg" data-toggle="tooltip" data-placement="bottom" title="Delete Component"></span>
            </div>
            <div id="canvasDiv">
                <div id="p5_loading" class="loadingclass">Loading....</div>
            </div>
        </div>
    </div>


    <div id="bottomPanel" class="container-fluid">
        <div class="row">
            <div id="bottomPanelTitleContainer" class="container-fluid" >
                <div class="row">
                    <div class="col">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a class="nav-link active" href="#">Connections</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Console</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Link</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                            </li>

                            
                        </ul>
                    </div>
                    <div class="col">
                        <ul class="nav justify-content-end nav-tabs" >
                            <li class="nav-item">
                                <a href="#" id="createRoom" class="nav-link">Create Room</a>
                            </li>
                            <li class="nav-item">
                                <a href="/projects/leave-room" id="createRoom" class="nav-link">Leave Room</a>
                            </li>
                        </ul>
                    </div>
                </div>  
            </div>
        </div>
        <div class="row">
            <div id="bottomPanelContentContainer">
                <table id="connections-table" class="table table-sm">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">1st_Device</th>
                            <th scope="col">→</th>
                            <th scope="col">2nd_Device</th>
                            <th scope="col">Media_Type</th>
                            <th scope="col">IP_Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>No Connections</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <b-tooltip target="canvasDeleteButton" placement="bottom">
        Delete selected component
    </b-tooltip>
    <b-tooltip target="canvasSaveProject" placement="bottom">
        Save network
    </b-tooltip>
    <b-tooltip target="canvasLoadProject" placement="bottom">
        Load network
    </b-tooltip>
  </div>
</template>

<script>
import componentController from '@/assets/js/controller/componentController.js';
import ioController from '@/assets/js/controller/ioController.js';
import p5Controller from '@/assets/js/controller/p5Controller.js';
import saveLoadController from '@/assets/js/controller/saveLoadController.js';

window.onload = function() {
    saveLoadController.init();
    componentController.init();
    ioController.init();    
}

export default {
    name: 'Canvas',
    props: {
    },
    mounted() {
        p5Controller.createNewCanvas();
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /* BASE */
    /* NAVBAR CUSTOM CLASSES */

    .navbar-nav .nav-link {
        padding-right: .5rem;
        padding-left: .5rem;
    }
    .navbar-brand {
        font-weight: 300;
    }

    a>.card:hover {
        border-color: #007bff!important;
    }

    /* P5 STYLES */

    #barLabels {
        height: 20;
        color: white;
    }

    #components {
        background-color: burlywood;
    }

    .compDiv {
        display: inline;
    }

    .componentImg {
        width: 50px;
        height: 50px;
        margin: 5px 15px;
    }
    .componentImg:hover {
        opacity: 0.7;
        cursor: pointer;
    }

    .ComponentBar {
        width: 80;
        height: 20;
        background-color: grey;
        display: inline-block;
        vertical-align: top;
        padding: 5px;

    }
    .canvasButtonContainer {
        position: absolute;
        overflow: hidden;
        height: 50px;
        z-index: 100;
    }
    .canvasButton {
        margin: 15px 8px 0 5px;
    }
    .canvasButton:hover {
        opacity: 0.7;
        cursor: pointer; 
    }

    .upload_input {
        display: none;
    }


    .bg-dark {
        background-color: #191919!important;
    }


    /* Added visability hidden to hide html when toast is hidden */
    .toast.hide {
        display: none;
        visibility: hidden;
    }

    #interfaceContainer {
        background-color: #dddddd;
        text-align: left;
        position: absolute;
        width: 150px;
        font: 12px sans-serif;
        box-shadow: 5px 5px 8px rgba(0,0,0,0.35);
        color: #000000;
    }

    .portButton {
        width: 100%;
        background-color: #aefda3;
    }
    .disabledPortButton {
        background-color: rgb(255, 144, 144);
    }
    #portContainer {
        width: 100%;
        display: block;
        position: relative;
    }
    #interfaceTitleContainer {
        width: 100%;
        text-align: center;
    }

    /* Component Panel */
    .dg.a {
        margin-right: 0px;
    }
    #rightSidePanel {
        position: absolute;
        right: 0px;
    }
    #bottomPanel {
        position: absolute;
        top: initial;
        bottom: 0px;
        position: fixed;
        height: 30px;
        background-color: #cccccc;
        transition: height 0.30s ease-out;
        transition-delay: 2s;
    }
    #bottomPanel:hover {
        height: 300px;
        transition: height 0.25s ease-in;
    }
    #bottomPanelTitleContainer {
        background-color: #eeeeee;
    }
    .panel-title-container {
        height: fit-content;
        width: fit-content;
        padding: 5px;
        display: inline-block;
    }
    #bottomPanelContentContainer {
        width: 100%;
        max-height: 280px;
        margin: 7px;
        background-color: #eeeeee;
    }
    #connections-table {
        height: fit-content;
    }
    .qs_valid_ip_address {
        color: green;
    }
    .qs_invalid_ip_address {
        color: red;
    }
</style>
