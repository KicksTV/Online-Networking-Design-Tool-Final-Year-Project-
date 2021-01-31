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
                <div aria-live="polite" aria-atomic="true" style="position: absolute; bottom: 0; right: 50px; min-height: 300px;">
                    <!-- Position it -->
                    <div style="position: absolute; top: 0; right: 0; min-width: 300px;">
                        <div id="copyToastAlert" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="10000" data-autohide="true" animation="true">
                            <div class="toast-header">
                                <svg class="rounded mr-2 bi bi-info-fill" width="2em" height="2em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533l1.002-4.705zM10 7.5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                                </svg>
                                <strong class="mr-auto">Copy Alert</strong>
                                <small class="text-muted">2 seconds ago</small>
                                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="toast-body">
                                ...
                            </div>
                        </div>

                        <div id="cutToastAlert" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="10000" data-autohide="true" animation="true">
                            <div class="toast-header">
                                <svg class="rounded mr-2 bi bi-info-fill" width="2em" height="2em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533l1.002-4.705zM10 7.5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                                </svg>
                                <strong class="mr-auto">Cut Alert</strong>
                                <small class="text-muted">2 seconds ago</small>
                                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="toast-body">
                                ...
                            </div>
                        </div>

                        <div id="pasteToastAlert" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="10000" data-autohide="true" animation="true">
                            <div class="toast-header">
                                <svg class="rounded mr-2 bi bi-info-fill" width="2em" height="2em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533l1.002-4.705zM10 7.5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                                </svg>
                                <strong class="mr-auto">Paste Alert</strong>
                                <small class="text-muted">2 seconds ago</small>
                                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="toast-body">
                                ...
                            </div>
                        </div>

                        <div id="deleteToastAlert" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="10000" data-autohide="true" animation="true">
                            <div class="toast-header">
                                <svg class="rounded mr-2 bi bi-alert-circle-fill" width="2em" height="2em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8.998 3a1 1 0 112 0 1 1 0 01-2 0zM10 6a.905.905 0 00-.9.995l.35 3.507a.553.553 0 001.1 0l.35-3.507A.905.905 0 0010 6z" clip-rule="evenodd"></path>
                                </svg>
                                <strong class="mr-auto">Delete Alert</strong>
                                <small class="text-muted">2 seconds ago</small>
                                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="toast-body">
                                ...
                            </div>
                        </div>

                        <div id="startConnectionToastAlert" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="10000" data-autohide="true" animation="true">
                            <div class="toast-header">
                                <svg class="rounded mr-2 bi bi-info-fill" width="2em" height="2em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533l1.002-4.705zM10 7.5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                                </svg>
                                <strong class="mr-auto">Link Component Started</strong>
                                <!-- <small class="text-muted">2 seconds ago</small> -->
                                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="toast-body">
                                ...
                            </div>
                        </div>

                        <div id="warningConnectionToastAlert" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="10000" data-autohide="true" animation="true">
                            <div class="toast-header">
                                <svg class="rounded mr-2 bi bi-info-fill" width="2em" height="2em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533l1.002-4.705zM10 7.5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                                </svg>
                                <strong class="mr-auto">Link Component Warning</strong>
                                <!-- <small class="text-muted">2 seconds ago</small> -->
                                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="toast-body">
                                ...
                            </div>
                        </div>

                        <div id="finishedConnectionToastAlert" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="10000" data-autohide="true" animation="true">
                            <div class="toast-header">
                                <svg class="rounded mr-2 bi bi-info-fill" width="2em" height="2em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533l1.002-4.705zM10 7.5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                                </svg>
                                <strong class="mr-auto">Link Component Completed</strong>
                                <!-- <small class="text-muted">2 seconds ago</small> -->
                                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="toast-body">
                                ...
                            </div>
                        </div>
                    </div>
                </div>
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

};  

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
<style scoped></style>
