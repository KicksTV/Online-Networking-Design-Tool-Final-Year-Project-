<template>
    <div>
        <div id="bottomPanel" class="container-fluid" style="width: 100%; height: 30px;">
            <div class="row">
                <div id="bottomPanelTitleContainer" class="container-fluid">
                    <div class="row">
                        <div class="col">
                            <ul class="nav nav-tabs">
                                <li class="nav-item">
                                    <a href="#" class="nav-link active">Connections</a></li>
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
                                <li class="nav-item">
                                    <a href="#" id="createRoom" class="nav-link">Create Room</a></li>
                                <li class="nav-item">
                                    <a href="/projects/leave-room" id="createRoom" class="nav-link">Leave Room</a></li>
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

    export default {
        name: "BottomPanel",
        props: {

        },
        methods: {
           
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
    a {
        color: #007bff;
        text-decoration: none;
        background-color: transparent;
    }
</style>