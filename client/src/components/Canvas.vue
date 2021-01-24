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
