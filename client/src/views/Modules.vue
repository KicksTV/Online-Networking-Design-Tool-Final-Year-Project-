<template>
    <div class="container-fluid mt-5">
        <div class="card-deck mb-4">
            <b-button v-if="user && (user.isAdmin || user.isTeacher)" id="createProjectBtn" @click="createModuleModel=true" class="col-3 py-0">
                <a style="text-decoration: none;">
                    <div class="card mx-1">
                        <img class="m-4" src="@/assets/img/add.png" width="50px" height="50px" alt="Image of plus icon">
                        <div class="card-body py-0 pb-1">
                            <h5 class="card-title">New Module</h5>
                            <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                            <!-- <a href="/projects/newproject" class="btn btn-primary"></a> -->
                        </div>
                    </div>
                </a>
            </b-button>
            <!-- Button trigger modal -->
        
        </div>
        <br>

        <div class="mb-2"><h1 class="display-4 d-inline"><strong>Modules & Tasks</strong></h1></div>
        <div class="col-12 mb-4">
            <div id="" class="card-deck row flex-nowrap" style="overflow-x: auto;">
                <div v-for="mod in savedModules" :key="mod.id" class="col-3 px-0">
                    <div class="card px-2" @click="editModule(mod)">
                        <img :src="mod.img ? mod.img : '/img/SimpleNetworkDesign.PNG'" class="card-img-top" :alt="mod.imgAlt">
                        <div class="card-body">
                            <h5 class="card-title">{{ mod.name }}</h5>
                            <p class="card-text">
                                Slug: {{mod.slug}}
                            </p>
                            <small class="d-block">{{mod.description}}</small>
                            <a class="btn btn-primary">Go to tasks</a>
                        </div>
                    </div>
                </div>
                <div v-if="!savedModules.length"><p>No module have been created yet!</p></div>
            </div>
        </div>
        <!-- Modal -->
        <b-modal v-model="createModuleModel" id="createModuleModel" title="Module settings">
            <form ref="createModuleForm" method="POST">
                <div class="modal-body">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="project_name">Name</span>
                        </div>
                        <input name="module_name" type="text" class="form-control" required aria-label="module_name" aria-describedby="module_name">
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="project_name">Slug</span>
                        </div>
                        <input name="module_slug" type="text" class="form-control" required aria-label="module_slug" aria-describedby="module_slug">
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="project_name">Description</span>
                        </div>
                        <input name="module_description" type="text" class="form-control" required aria-label="module_description" aria-describedby="module_description">
                    </div>
                </div>
            </form>
            <template #modal-footer>
                <div class="w-100">
                    <b-button
                        variant="primary"
                        size="sm"
                        class="float-right"
                        @click="createModule">
                        Create
                    </b-button>
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right mr-2"
                        @click="createModuleModel=false">
                        Close
                    </b-button>
                </div>
            </template>
        </b-modal>
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
.card:hover {
    border: 3px solid rgba(0,0,0,.125);
    cursor: pointer;
}
</style>

<script>
// import axios from "axios";
// @ is an alias to /src
// import HelloWorld from '@/assets/js/HelloWorld.vue'

const _ = require('lodash');

export default {
    name: 'Modules',
    components: {},
    data () {
        return {
            HTTP: this.$parent.$parent.HTTP,
            user: this.$parent.user,
            createModuleModel: false,
            saved_modules: [],
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
        createModule() {
            var self = this;
            var form = self.$refs.createModuleForm
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
            console.log(emptyRequiredFields)
            if (emptyRequiredFields.length > 0) {
                // form error
            } else {
                var module_data = {
                    name: fieldsValues[0],
                    slug: fieldsValues[1],
                    description: fieldsValues[2],

                }
                // form.submit()
                self.HTTP.post(`api/module/${self.user.username}/`, {module: module_data})
                    .then(response => {
                        console.log(response)
                        if (response.data) {
                            console.log(response.data.modules)
                            self.saved_modules.push(response.data)
                        }
                        this.loading = false
                        self.$bvModal.hide('createModuleModel')
                    })
                    .catch(error => {
                        console.log(error)
                        this.errored = true
                        this.loading = false
                        return null
                    })
                    .finally(() => this.loading = false)
            }
        },
        getModuleData: function() {
            var self = this;
            self.HTTP.get(`/api/module/${self.user.username}/`)
                .then(response => {
                    // console.log(response, response.data)
                    if (response.data) {
                        // console.log(response.data)
                        self.saved_modules = response.data
                        // console.log(self.saved_modules)
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
            self.HTTP.get(`/api/module/all/`)
                .then(response => {
                    // console.log(response, response.data)
                    if (response.data) {
                        self.saved_modules = response.data
                    }
                    this.loading = false
                    return self.saved_modules
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
        savedModules: function() {
            console.log(_.orderBy(this.saved_modules, ['updatedAt'], ['desc']))
            return this.saved_modules
        },
        includedModules: function() {
            return this.included_modules        
        }

    },
    mounted: async function() {
        var self = this
        self.user = await self.$parent.getUserData()
        console.log(self.user)

        if (self.user) {
            self.getModulesData()
            console.log( self.getModulesData())
        }
       
    }
}
</script>
