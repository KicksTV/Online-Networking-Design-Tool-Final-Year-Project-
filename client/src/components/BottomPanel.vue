<template>
    <div>
        <div id="bottomPanel" class="container-fluid" style="width: 100%; height: 30px;">
            <div class="row">
                <div id="bottomPanelTitleContainer" class="container-fluid">
                    <b-tabs content-class="" :nav-class="['']">
                        <b-tab active>
                            <template #title>
                                <p class="tab-title">Connections</p>
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
                        <b-tab title="Console" disabled></b-tab>
                        <b-tab @click="$event.target.classList.add('d-none')" :title-item-class="['ml-auto']">
                            <template #title>
                                <p class="tab-title">Create Room</p>
                            </template>
                            <p>create room</p>
                        </b-tab> 
                        <b-tab :title-item-class="['ml-auto d-none']">
                            <template #title>
                                <p class="tab-title">Room</p>
                            </template>
                            <p>room</p>
                        </b-tab>
                    </b-tabs>
                    <!-- <div class="col">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a href="#connectionPanel" class="nav-link active">Connections</a></li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">Console</a></li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">Link</a></li>
                            <li class="nav-item">
                                <a href="#" tabindex="-1" aria-disabled="true" class="nav-link disabled">Disabled</a></li>
                        </ul>
                    </div>
                    <div class="col">
                        <ul class="nav justify-content-end nav-tabs">
                            <li @click="createRoom" class="nav-item">
                                <a href="#" id="createRoom" class="nav-link">Create Room</a></li>
                            <li ref="room_tab" class="nav-item d-none">
                                <a href="#roomPanel" id="room" class="nav-link">Room</a></li>
                            <li class="nav-item">
                                <a href="/projects/leave-room" id="createRoom" class="nav-link">Leave Room</a></li>
                        </ul>
                    </div> -->
                </div>
            </div>
            <!-- <div class="row">
                <div id="bottomPanelContentContainer">
                    <div id="connectionPanel">
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
                    <div id="roomPanel">
                        
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
    import ioController from '../assets/js/controller/ioController.js'
    export default {
        name: "BottomPanel",
        props: {

        },
        methods: {
            createRoom: async function(e) {
                var self = this
                await ioController.initIO()
                let socketID = ioController.getSocket().id
                ioController.sendData('createRoom', socketID)

                e.target.style.display = "none"
                self.$refs.room_tab.classList.remove('d-none')
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
</style>