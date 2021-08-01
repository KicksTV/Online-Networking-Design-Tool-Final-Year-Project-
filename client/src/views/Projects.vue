<template>
  <div class="container-fluid mt-5">
    <h1 class="display-4"><strong>Create or load a project</strong></h1><br>
    <div class="card-deck">
        <b-button id="createProjectBtn" @click="createProjectModel=true" style="padding: 0;">
            <a style="text-decoration: none;">
                <div class="card" style="width: 18rem;">
                    <img class="" src="@/assets/img/add.png" style="margin: 20px;" width="50px" height="50px" alt="Image of plus icon">
                    <div class="card-body">
                        <h5 class="card-title">New Project</h5>
                        <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                        <!-- <a href="/projects/newproject" class="btn btn-primary"></a> -->
                    </div>
                    
                </div>
            </a>
        </b-button>
        <router-link to="#" class="disabled" style="text-decoration: none;">
            <div class="card" style="width: 18rem;">
                <img class="" src="@/assets/img/add.png" style="margin: 20px;" width="50px" height="50px" alt="Image of plus icon">
                <div class="card-body">
                    <h5 class="card-title">Load Project</h5>
                    <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                    <!-- <a href="/projects/newproject" class="btn btn-primary"></a> -->
                </div>
                
            </div>
        </router-link>
        <!-- Button trigger modal -->
        <b-button id="joinRoomBtn" @click="joinRoom=true" style="padding: 0;">
            <a>
                <div class="card" style="width: 18rem;">
                    <img class="" src="@/assets/img/add.png" style="margin: 20px;" width="50px" height="50px" alt="Image of plus icon">
                    <div class="card-body">
                        <h5 class="card-title">Join Room</h5>
                    </div>
                </div>
            </a>
        </b-button>
    </div>
    <br>
    <h1 class="display-4">Or, here are some included projects</h1><br>
    <div class="col-md-6">
        <div class="card-deck">
            <div v-for="project in projects" :key="project.name" class="card" style="width: 18rem;">
                <img :src="project.img" class="card-img-top" alt="project.imgAlt">
                <div class="card-body">
                <h5 class="card-title">{{ project.name }}</h5>
                <p class="card-text"></p>
                <button @click="setDefaultProject(project)" class="btn btn-primary">Load Project</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <b-modal v-model="joinRoom" title="Please enter room id.">
        <form ref="joinRoomForm" action="/projects/join" method="post">
            <div class="modal-body">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">Room ID</span>
                    </div>
                    <input name="room_id" type="text" class="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1">
                </div>
            </div>
        </form>
        <template #modal-footer>
            <div class="w-100">
                <b-button
                    variant="primary"
                    size="sm"
                    class="float-right"
                    @click="$refs.joinRoomForm.submit()">
                    Join
                </b-button>
                <b-button
                    variant="light"
                    size="sm"
                    class="float-right mr-2"
                    @click="joinRoom=false">
                    Close
                </b-button>
            </div>
        </template>
    </b-modal>
    <!-- Modal -->
    <b-modal v-model="createProjectModel" title="Project settings">
        <form ref="createProjectForm">
            <div class="modal-body">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="project_name">Project Name</span>
                    </div>
                    <input name="project_name" type="text" class="form-control" required aria-label="project_name" aria-describedby="project_name">
                </div>
                <input name="creation_date" type="hidden" required :value="new Date().toISOString()">
            </div>
        </form>
        <template #modal-footer>
            <div class="w-100">
                <b-button
                    variant="primary"
                    size="sm"
                    class="float-right"
                    @click="createProject">
                    Create
                </b-button>
                <b-button
                    variant="light"
                    size="sm"
                    class="float-right mr-2"
                    @click="createProjectModel=false">
                    Close
                </b-button>
            </div>
        </template>
    </b-modal>
    <div class="modal fade" id="errorModel" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="errorModel">Error</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

            
  </div>
</template>

<style scoped>
#joinRoomBtn {
    text-align: left;
}
.card-title {
    color: black;
}
.btn-secondary:not(:disabled):not(.disabled).active, .btn-secondary:not(:disabled):not(.disabled):active, .show>.btn-secondary.dropdown-toggle {
    color: #fff;
}
</style>

<script>
import axios from "axios";
// @ is an alias to /src
// import HelloWorld from '@/assets/js/HelloWorld.vue'

export default {
  name: 'Projects',
  components: {},
  data () {
    return {
        projects: null,
        joinRoom: false,
        createProjectModel: false,
    }
  },
  methods: {
    setDefaultProject(pro) {
        var self = this
        self._routerRoot._router.push({ name: 'NewProject', params: { 'loadedProject': pro }})
    },
    createProject() {
        var self = this,
            settings=null;
        var form = self.$refs.createProjectForm
        var requiredFields = []
        var emptyRequiredFields = []
        var fieldsValues = []
        form.querySelectorAll('input').forEach((el) => {
            if (el.getAttribute("required")) {
                requiredFields.push(el)
                if (el.value !== '') {
                    fieldsValues.push(el.value)
                } else {
                    emptyRequiredFields.push(el)
                }
            }
        })
        if (emptyRequiredFields.length > 0) {
            // form error
        } else {
            // console.log(fieldsValues)
            settings = {
                name: fieldsValues[0],
                creationDate: fieldsValues[1],
            }
        }
        // console.log(settings)
        self._routerRoot._router.push({ name: 'NewProject', params: { 'projectSettings': settings }})
    }
  },
  mounted: function() {
    var self = this
    axios.get('/js/defaultProjects.json').then(response => {
        self.projects = response.data.projects
        console.log(self.projects)
    })
  }
}
</script>
