<template>
  <div>
    <div id="canvasContainer" ref="canvasContainer">
        <div id="canvasRow">
            <div id="projectDetails">
                <div class="canvasButtonContainer row">
                    <span @click="loadProject" ref="loadProject" id="canvasLoadProject" class="canvasButton fas fa-file-upload fa-lg" data-toggle="tooltip" data-placement="bottom" title="Load Project"></span>
                    <input ref="upload_input" id="upload_input" type="file" name="project_upload" class="upload_input" />
                    <span @click="saveProject" id="canvasSaveProject" class="canvasButton fas fa-save fa-lg" data-toggle="tooltip" data-placement="bottom" title="Save Project"></span>
                    <span id="canvasDeleteButton" class="canvasButton fas fa-trash-alt fa-lg" data-toggle="tooltip" data-placement="bottom" title="Delete Component"></span>
                    <span id="canvasRunBtn" @click="runValidiationChecks" class="canvasButton fas fa-play fa-lg" data-toggle="tooltip" data-placement="bottom" title="Run network and validation checks"></span>
                </div>
                <h4 @click="editProjectName" class="mt-2 ml-2">{{ projectName }}</h4>
                <input id="projectNameInput" type="text" class="d-none form-controls mt-2">
            </div>
            <div id="canvasDiv">
                <div id="p5_loading" class="loadingclass">Loading....</div>
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
    <b-tooltip target="canvasRunBtn" placement="bottom">
        Run network and validation checks
    </b-tooltip>
  </div>
</template>

<script>

import Vue from 'vue'

// Controllers
import componentController from '@/assets/js/controller/componentController.js';
import ioController from '@/assets/js/controller/ioController.js';
import p5Controller from '@/assets/js/controller/p5Controller.js';
import saveLoadController from '@/assets/js/controller/saveLoadController.js';
import connectionController from '@/assets/js/controller/connectionController.js';
import networkController from '@/assets/js/controller/networkController.js';
import panelController from '@/assets/js/controller/panelController.js';
import validationController from '@/assets/js/controller/validationController.js';
import projectSettings from '@/assets/js/controller/ProjectSettingsController.js';



// Collections
import allSubnets from '@/assets/js/collections/allSubnets.js';
import allComponents from '@/assets/js/collections/allComponents.js';
import allConnections from '@/assets/js/collections/allConnections.js';

// Models
import graph from '@/assets/js/models/graph.js';

// Vue components
import Gui from './Gui.vue'


window.onload = function() {
    saveLoadController.init();
    componentController.init();
}



/* eslint-disable */
export default {
    name: 'Canvas',
    data() {
        return {
            GuiClass: Vue.extend(Gui),
            projectName: 'New Project',
            guiRight: null,
            projectSettingGui: null,
        }
    },
    props: {
        componentController: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default: function () {
                return componentController
            }
        },
        ioController: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default: function () {
                return ioController
            }
        },
        p5Controller: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default: function () {
                return p5Controller
            }
        },
        saveLoadController: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default: function () {
                return saveLoadController
            }
        },
        connectionController: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default: function () {
                return connectionController
            }
        },
        networkController: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default: function () {
                return networkController
            }
        },
        panelController: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default: function () {
                return panelController
            }
        },
        validationController: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default: function () {
                return validationController
            }
        },
        allComponents: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default: function () {
                return allComponents
            }
        },
        allConnections: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default: function () {
                return allConnections
            }
        },
        allSubnets: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default: function () {
                return allSubnets
            }
        },
        graph: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default: function () {
                return graph
            }
        },
    },
    methods: {
        editProjectName: function(e) {
            // console.log(e)
            var projectNameHTML = e.target
            projectNameHTML.classList.add('d-none')
            var input = projectNameHTML.nextSibling
            input.value = projectNameHTML.innerHTML
            input.classList.remove('d-none')
            input.focus()

            input.addEventListener('keydown', (ekd) => {
                if(ekd.which==13 || ekd.keyCode==13){
                    input.blur();
                }
            })

            input.addEventListener('blur', () => {
                projectNameHTML.classList.remove('d-none')
                input.classList.add('d-none')
                projectNameHTML.innerHTML = input.value

                projectSettings.setName(input.value)
            })

        },
        saveProject: function() {
           var self = this
           self.saveLoadController.saveEventToFile()
        },
        loadProject: function() {
            var self = this
            self.$refs.loadProject.addEventListener("click", () => {
                self.$refs.upload_input.click();
            });
            self.$refs.upload_input.onchange = self.saveLoadController.loadEvent;
        },
        runValidiationChecks: function() {
            var self = this
            console.log("run validation check")
            self.validationController.runValidationCheck()
        },
        toggleProjectSettings: function() {
            var self = this
            //   projectSettings.initGUI()
            if (self.projectSettingGui.showing) {
                self.projectSettingGui.hide()
            } else {
                self.projectSettingGui.show()
            }
        },
        initGuiRight: function() {
            var self = this
            self.guiRight = new self.GuiClass({
                propsData: {},
            })
            self.guiRight.$mount()
            self.guiRight.init('rightSidePanel')
            self.guiRight.addFolder(projectSettings, "Project Settings", false)
            self.guiRight.width = 400;
            self.$children.push(self.guiRight)

            networkController.initGUI(self.guiRight.datgui);
            networkController.initNetworkListener(self.guiRight.datgui);
        },
        setup(sketch) {
            sketch.background('green');
            sketch.text('Hello p5!', 20, 20);
        }
    },
    created: function() {
        var self = this;
        // self.initGuiRight()
        // p5Controller.createNewCanvas()
    },
    mounted() {
        var self = this;
        self.initGuiRight()
        p5Controller.createNewCanvas()
        var room_id = (self.$root._route.query.room_id ) ? self.$root._route.query.room_id : null
        if (room_id) ioController.init(room_id)   

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
    #projectDetails {
        position: absolute;
        overflow: hidden;
        height: 80px;
        z-index: 100;
        margin-left: 20px;
        min-width: 100px;
    }
    .canvasButton {
        padding: 15px 15px 0 15px;
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
</style>
