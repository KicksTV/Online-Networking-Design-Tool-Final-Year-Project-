<template>
    <div class="container-fluid mt-5">
        <div class="card-deck mb-4">
            <b-button v-if="user && (user.isAdmin || user.isTeacher)" id="createProjectBtn" @click="isCreatingModal(true)" class="col-3 py-0">
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
            <div class="col-3"><input type="text" class="form-control" v-model="searchBox" placeholder="Search for module"></div>
            <div id="" class="card-deck row flex-nowrap py-4" style="overflow-x: auto;">
                <div v-for="mod in filteredModules" :key="mod.id" class="col-3 px-0">
                    <div class="card">
                        <img :src="mod.img ? mod.img : '/img/SimpleNetworkDesign.PNG'" class="card-img-top" :alt="mod.imgAlt">
                        <div class="card-body">
                            <h5 class="card-title">{{ mod.name }}</h5>
                            <p class="card-text">
                                Slug: {{mod.slug}}
                            </p>
                            <small class="d-block">{{mod.description}}</small>
                        </div>
                        <footer class="card-footer">
                            <a :href="'modules/'+mod.slug+'/tasks/'" class="btn btn-primary">Tasks</a>
                            <a class="btn btn-warning float-right" @click="isEditingModule(true, mod)">Edit</a>
                        </footer>
                    </div>
                </div>
                <div v-if="!savedModules.length"><p>No module have been created yet!</p></div>
            </div>
        </div>
        <!-- Modal -->
        <b-modal ref="createModule" v-model="showModuleModel" id="createModuleModel" title="Module settings">
            <form id="createModuleForm" @submit.prevent="submitModule">
                <button id="createModuleFormSubmit" type="submit" class="d-none"></button>
                <div class="modal-body">
                    <input type="hidden" :value="currentModule.id">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="project_name">Name</span>
                        </div>
                        <!-- <input name="module_name" type="text" class="form-control" required aria-label="module_name" aria-describedby="module_name"> -->
                        <bound-input :isEditing="editingModuleComputed" 
                                     v-bind:current="currentModule" 
                                     @update-value="moduleUpdateValue" 
                                     name="module_name" _type="text" 
                                     class="form-control" 
                                     :required="true" 
                                     ariaLabel="module_name" 
                                     ariaDescribedby="module_name"></bound-input>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="project_name">Slug</span>
                        </div>
                        <bound-input :isEditing="editingModuleComputed" 
                                     v-bind:current="currentModule" 
                                     @update-value="moduleUpdateValue"
                                     :name="'module_slug'" 
                                     _type="text" class="form-control" 
                                     :required="true"    
                                     :ariaLabel="'module_slug'" 
                                     :ariaDescribedby="'module_slug'"></bound-input>
                        <!-- <input name="module_slug" type="text" class="form-control" required aria-label="module_slug" aria-describedby="module_slug"> -->
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="project_name">Description</span>
                        </div>
                        <bound-input :isEditing="editingModuleComputed" 
                                     v-bind:current="currentModule" 
                                     @update-value="moduleUpdateValue"
                                     :name="'module_description'" 
                                     _type="text" class="form-control" 
                                     :required="true"    
                                     :ariaLabel="'module_description'" 
                                     :ariaDescribedby="'module_description'"></bound-input>
                        <!-- <input name="module_description" type="text" class="form-control" required aria-label="module_description" aria-describedby="module_description"> -->
                    </div>
                </div>
            </form>
            <template #modal-footer>
                <div class="w-100">
                    <b-button
                        variant="primary"
                        size="sm"
                        class="float-right"
                        @click="submitForm()" v-html="editingModule ? 'Save edit' : 'Create'">
                    </b-button>
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right mr-2"
                        @click="showModuleModel=false">
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
/* .card:hover {
    border: 3px solid rgba(0,0,0,.125);
    cursor: pointer;
} */
</style>

<script>
// import axios from "axios";
// @ is an alias to /src

import { mapState, mapActions  } from 'vuex'

import boundInput from '@/components/boundInput.vue'
// import boundSelect from '@/components/boundSelect.vue'

// import searchInput from '@/components/searchInput.vue'

// mixins
import filterSortMixin from '@/mixins/filterSortMixin.vue'



const _ = require('lodash');

export default {
    name: 'Modules',
    components: {
        'bound-input': boundInput,
        // 'bound-select': boundSelect,
    },
    mixins: [filterSortMixin],
    props: {
        searchFields: {
            type: Array,
            default: function () { return ['name', 'slug', 'description'] }
        }
    },
    data () {
        return {
            HTTP: this.$parent.$parent.HTTP,
            user: this.$parent.user,
            showModuleModel: false,
            editingModule: false,
            creatingModule: false
        }
    },
    methods: {
        ...mapActions('mod', [
            'createModule',
            'editModule',
            'getAllModules',
            'setEditModule',
            'updateField'
        ]),
        setDefaultProject(pro) {
            var self = this
            self._routerRoot._router.push({ name: 'NewProject', params: { 'loadedProject': pro }})
        },
        loadSavedProject(pro) {
            var self = this
            console.log(pro)
            self._routerRoot._router.push({ name: 'NewProject', params: { 'loadedProject': pro }})

        },
        submitForm: function() {
            var createModuleFormSubmit = document.getElementById('createModuleFormSubmit')
            createModuleFormSubmit.click();
        },
        submitModule(e) {
            var self = this;
            var form = e.target
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
                } else {
                    fieldsValues.push(el.value)
                }
            })
            console.log(emptyRequiredFields)
            if (emptyRequiredFields.length > 0) {
                // form error
                alert("form error")
            } else {
                var module_data = {
                    id: fieldsValues[0],
                    name: fieldsValues[1],
                    slug: fieldsValues[2],
                    description: fieldsValues[3],
                    username: self.user.username

                }



                if (self.creatingModule) {
                    var created = self.createModule(module_data)
                } else {
                    // editing module
                    var edited = self.editModule(module_data)
                }

                if (created || edited) {
                    this.$bvModal.hide('createModuleModel')
                }
                
            }
        },
        isCreatingModal: function(should_show) {
            this.creatingModule=should_show
            this.showModuleModel=should_show

            this.editingModule=!should_show
        },
        isEditingModule: function(should_show, mod) {
            this.editingModule=should_show
            this.showModuleModel = should_show

            // console.log(mod)
            this.setEditModule(mod)
        },
        moduleUpdateValue: function(e) {
            console.log(e)
            var self = this,
                value = e.target.value;
            var name = e.target.name.split('_')[1]
            // console.log("here", value)
            self.$store.commit(`mod/updateField`, {'prop': name, 'val': value})
        }
    },
    computed: {
        ...mapState({
            savedModules: state => _.orderBy(state.mod.all, ['updatedAt'], ['asc']),
            editingModuleComputed: function() {
                return this.editingModule
            },
        }),
        filteredModules: function() {
            return this.filteredList(this.savedModules)
        },
        currentModule: function() {
            return this.$store.getters[`mod/getCurrent`]
        },
    },
    created: function() {
        this.$store.dispatch('mod/getAllModules')
    },
    mounted: async function() {
        var self = this
        self.user = await self.$parent.getUserData()
        // console.log(self.user)
        // console.log(self.mod.all)
        this.indexList(this.savedModules, 'updatedAt', 'slug')
    }
}
</script>
