
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
                        <b-tab v-if="process.env.NODE_ENV !== 'production'" title="Console" disabled></b-tab>
                        <b-tab v-if="process.env.NODE_ENV !== 'production'" :title-item-class="['ml-auto']">
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
           }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
    .nav-link.active .tab-title {
        color: blue;
        text-decoration: none;
    }
    .tab-content, .tab-pane {
        height: 100%;
    }
</style>