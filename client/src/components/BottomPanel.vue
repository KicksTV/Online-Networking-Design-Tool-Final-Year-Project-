<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
    .tab-title {
        color: black;
        text-decoration: none;
    }
    .nav-link {
        color: black;
    }
    .nav-link.active, .nav-link:hover {
        color: #007bff !important;
    }
    .nav-link.active .tab-title {
        color: #007bff;
        text-decoration: none;
    }
    #bottomPanel .tabs {
        height: 100%;
    }
    .tab-content, .tab-pane {
        height: 100%;
    }
    textarea:focus-visible {
        outline: 0px;
    }
    p {
        margin-bottom: 0 !important;
    }
    #consoleDiv {
        display: flex;
        flex-flow: column;
        height: 80%;
    }
    #console {
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 15px;
    }
    #consoleInput {
        height: 20%;
    }
    
</style>

<template>
    <div>
        <div id="bottomPanel" class="container-fluid" style="width: 100%;">
            <div class="row h-100">
                <div id="bottomPanelTitleContainer" class="container-fluid h-100">
                    <b-tabs content-class="" :nav-class="['']">
                        <b-tab active>
                            <template #title>
                                <p class="tab-title mb-0">Connections</p>
                            </template>
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
                        </b-tab>

                        <b-tab :title-item-class="['text-black']" title="Console" id="consoleDiv">
                            <div ref="console" id="console" class="w-100 h-100 bg-light">
                                <p>The console will display success, infomational, warning and error messages.</p>
                            </div>
                            <textarea class="border-0 w-100" name="" id="consoleInput" cols="1" rows="1"></textarea>
                        </b-tab>


                        <b-tab v-if="$root.isDevelopment()" :title-item-class="['ml-auto']">
                            <template #title class="h-100">
                                <p class="tab-title mb-0">Room</p>
                            </template>
                            <a class="btn btn-primary h-100" href="">Create Room</a>
                        </b-tab> 
                    </b-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // import ioController from '../assets/js/controller/ioController.js'
    export default {
        name: "BottomPanel",
        props: {

        },
        methods: {
            createRoom: async function(e) {
                // await ioController.initIO()
                // let socketID = ioController.getSocket().id
                // ioController.sendData('createRoom', socketID)
                e.target.closest("li.nav-item").classList.add('d-none')
                e.target.closest("li.nav-item").nextSibling.classList.remove('d-none')
           },

            consoleErrorMsg: function(msg) {
                var self = this,
                    console_el = self.$refs.console;

                console_el.innerHTML += `<p class="text-danger"><i>${new Date().toLocaleTimeString()}</i> Error: ${msg}</p>`
            },
            consoleInfoMsg: function(msg) {
                var self = this,
                    console_el = self.$refs.console;

                console_el.innerHTML += `<p class="text-info"><i>${new Date().toLocaleTimeString()}</i> Info: ${msg}</p>`
            },
            consoleWarningMsg: function(msg) {
                var self = this,
                    console_el = self.$refs.console;

                console_el.innerHTML += `<p class="text-warning"><i>${new Date().toLocaleTimeString()}</i> Warning: ${msg}</p>`
            }
        },
    }
</script>