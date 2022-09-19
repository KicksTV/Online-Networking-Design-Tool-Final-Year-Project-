<template>
  <div class="container-fluid mt-5">
    <div class="card-deck mb-4">
        <b-button id="createProjectBtn" @click="createProjectModel=true" class="col-3 py-0">
            <a style="text-decoration: none;">
                <div class="card mx-1">
                    <img class="m-4" src="@/assets/img/add.png" width="50px" height="50px" alt="Image of plus icon">
                    <div class="card-body py-0 pb-1">
                        <h5 class="card-title">New Project</h5>
                        <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                        <!-- <a href="/projects/newproject" class="btn btn-primary"></a> -->
                    </div>
                    
                </div>
            </a>
        </b-button>
        <router-link v-if="$root.isDevelopment()" to="#" class="col-3 disabled" style="text-decoration: none;">
            <div class="card mx-1">
                <img class="m-4" src="@/assets/img/add.png" width="50px" height="50px" alt="Image of plus icon">
                <div class="card-body py-0 pb-1">
                    <h5 class="card-title">Load Project</h5>
                    <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                    <!-- <a href="/projects/newproject" class="btn btn-primary"></a> -->
                </div>
                
            </div>
        </router-link>
        <!-- Button trigger modal -->
        <b-button v-if="$root.isDevelopment()" id="joinRoomBtn" @click="joinRoom=true" class="col-3 py-0">
            <a style="text-decoration: none;">
                <div class="card mx-1">
                    <img class="m-4" src="@/assets/img/add.png" width="50px" height="50px" alt="Image of plus icon">
                    <div class="card-body py-0 pb-1">
                        <h5 class="card-title">Join Room</h5>
                    </div>
                </div>
            </a>
        </b-button>
    </div>
    <br>


    <div class="mb-2" v-if="savedProjects.length"><h1 class="display-4 d-inline"><strong>Load a saved project</strong></h1>
    <h4 v-if="savedProjects" class="d-inline my-1"><b-badge class="ml-2">{{savedProjects.length}}</b-badge></h4></div>
    <div v-if="savedProjects" class="col-12 mb-4">
        <div id="savedProjectsContainer" class="card-deck row flex-nowrap" style="overflow-x: auto;">
            <div v-for="project in savedProjects" :key="project.slug" class="col-3">
                <div class="card px-2">
                    <img :src="project.img ? project.img : '/img/SimpleNetworkDesign.PNG'" class="card-img-top" :alt="project.imgAlt">
                    <div class="card-body">
                        <h5 class="card-title">{{ project.name }}</h5>
                        <p class="card-text">
                            Slug: {{project.slug}}<br>
                            Created at: {{project.createdAt}}<br>
                            Updated at: {{project.updatedAt}}
                        </p>
                        <a class="btn btn-primary" :href="'/projects/' + project.slug + '/'">Load Project</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- <h1 class="display-4">Or, here are some included projects</h1><br>
    <div class="col-md-6">
        <div class="card-deck">
            <div v-for="project in included_projects" :key="project.name" class="card" style="width: 18rem;">
                <img :src="project.img" class="card-img-top" alt="project.imgAlt">
                <div class="card-body pb-1">
                    <h5 class="card-title">{{ project.name }}</h5>
                    <p class="card-text"></p>
                    <button @click="setDefaultProject(project)" class="btn btn-primary">Load Project</button>
                </div>
            </div>
        </div>
    </div> -->

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
h1 {
    font-size: 2rem;
    font-weight: 300;
    line-height: 1.2;
}
#joinRoomBtn {
    text-align: left;
}
.card-title {
    color: black;
    text-align: left;
}
#savedProjectsContainer {
    overflow-x: auto;
}
.btn-secondary:not(:disabled):not(.disabled).active, .btn-secondary:not(:disabled):not(.disabled):active, .show>.btn-secondary.dropdown-toggle {
    color: #fff;
}
</style>

<script>
import axios from "axios";
// @ is an alias to /src
// import HelloWorld from '@/assets/js/HelloWorld.vue'

const _ = require('lodash');

export default {
    name: 'Projects',
    components: {},
    data () {
        return {
            HTTP: this.$parent.$parent.HTTP,
            user: this.$parent.user,
            joinRoom: false,
            createProjectModel: false,
            saved_projects: null,
            included_projects: null
        }
    },
    methods: {
        setDefaultProject(pro) {
            var self = this
            self._routerRoot._router.push({ name: 'NewProject', params: { 'loadedProject': pro }})
        },
        loadSavedProject(pro) {
            var self = this
            console.log(pro)
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
        },
        getProjectData: function() {
            var self = this
            self.HTTP.get(`api/project/${self.user.username}/`)
                .then(response => {
                    console.log(response)
                    if (response.data) {
                        self.saved_projects = response.data.projects
                    }
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                    this.errored = true
                    this.loading = false
                    return null
                })
                .finally(() => this.loading = false)
        },
        getModulesData: function() {
            var self = this
            self.HTTP.get(`api/project/${self.user.username}/`)
                .then(response => {
                    console.log(response)
                    if (response.data) {
                        self.saved_projects = response.data.projects
                    }
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                    this.errored = true
                    this.loading = false
                    return null
                })
                .finally(() => this.loading = false)
            
        },
    },
 
    computed: {
        savedProjects: function() {
            console.log(_.orderBy(this.saved_projects, ['updatedAt'], ['desc']))
            return _.orderBy(this.saved_projects, ['updatedAt'], ['desc'])
        },
        includedProjects: function() {
            return this.included_projects           
        }

    },
    mounted: async function() {
        var self = this
        self.user = await self.$parent.getUserData()
        console.log(self.user)

        if (self.user) {
            self.getProjectData()
            console.log( self.getProjectData())
        }
        axios.get('/js/defaultProjects.json').then(response => {
            self.included_projects = response.data.projects
        }).catch(err => {
            console.log(err)
        })
    }
}
</script>
