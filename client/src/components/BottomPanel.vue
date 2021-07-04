<template>
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
                    <tbody data-v-4336af88="">
                        <tr data-v-4336af88="">
                            <th data-v-4336af88="">No Connections</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "ComponentBar",
        props: {

        },
        methods: {
           
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>