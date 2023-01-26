<template>
    <div class="container-fluid mt-5">
        <div class="card-deck mb-4">
            <b-button v-if="user && (user.isAdmin || user.isTeacher)" id="createProjectBtn" @click="isCreatingModal(true)" class="col-3 py-0">
                <a style="text-decoration: none;">
                    <div class="card mx-1">
                        <img class="m-4" src="@/assets/img/add.png" width="50px" height="50px" alt="Image of plus icon">
                        <div class="card-body py-0 pb-1">
                            <h5 class="card-title">New Task</h5>
                            <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                            <!-- <a href="/projects/newproject" class="btn btn-primary"></a> -->
                        </div>
                    </div>
                </a>
            </b-button>
            <!-- Button trigger modal -->
        
        </div>
        <br>

        <div class="mb-2"><h1 class="display-4 d-inline"><strong>Tasks</strong></h1></div>
        <div class="col-12 mb-4">
            <div id="" class="card-deck row flex-nowrap py-4" style="overflow-x: auto;">
                <div v-for="task in savedTasks" :key="task.id" class="col-3 px-0">
                    <div class="card">
                        <img :src="task.img ? task.img : '/img/SimpleNetworkDesign.PNG'" class="card-img-top" :alt="task.imgAlt">
                        <div class="card-body">
                            <h5 class="card-title">{{ task.name }}</h5>
                            <p class="card-text">
                                Slug: {{task.slug}}
                            </p>
                            <small class="d-block">{{task.description}}</small>
                        </div>
                        <footer class="card-footer">
                            <a class="btn btn-warning float-right" @click="isEditingTask(true, task)">Edit</a>
                        </footer>
                    </div>
                </div>
                <div v-if="!savedTasks.length"><p>No tasks have been created yet!</p></div>
            </div>
        </div>
        <!-- Modal -->
        <b-modal ref="createTask" v-model="showTaskModel" id="createTaskModel" title="Task settings">
            <form id="createTaskForm" @submit.prevent="submitTask">
                <button id="createTaskFormSubmit" type="submit" class="d-none"></button>
                <div class="modal-body">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="project_name">Name</span>
                        </div>
                        <bound-input :isEditing="editingTaskComputed" module='task' name="task_name" _type="text" class="form-control" :required="true" ariaLabel="task_name" ariaDescribedby="task_name"></bound-input>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="project_name">Slug</span>
                        </div>
                        <bound-input :isEditing="editingTaskComputed" module='task' :name="'task_slug'" _type="text" class="form-control" :required="true" :ariaLabel="'task_slug'" :ariaDescribedby="'task_slug'"></bound-input>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="project_name">Description</span>
                        </div>
                        <bound-input :isEditing="editingTaskComputed" module='task' :name="'task_description'" _type="text" :class="'form-control'" :required="true" :ariaLabel="'task_description'" :ariaDescribedby="'task_description'"></bound-input>
                    </div>
                </div>
            </form>
            <template #modal-footer>
                <div class="w-100">
                    <b-button
                        variant="primary"
                        size="sm"
                        class="float-right"
                        @click="submitForm()">
                        Create
                    </b-button>
                    <b-button
                        variant="light"
                        size="sm"
                        class="float-right mr-2"
                        @click="showTaskModel=false">
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


// mixins
import filterSortMixin from '@/mixins/filterSortMixin.vue'

const _ = require('lodash');

export default {
    name: 'Tasks',
    components: {
        'bound-input': boundInput,
        // 'bound-select': boundSelect,
    },
    mixins: [filterSortMixin],
    data () {
        return {
            HTTP: this.$parent.$parent.HTTP,
            user: this.$parent.user,
            showTaskModel: false,
            editingTask: false,
            creatingTask: false,
            saved_tasks: [],
        }
    },
    methods: {
        ...mapActions('task', [
            'createTask',
            'getAllTasks',
            'setEditTask',
            'updateField'
        ]),
        submitForm: function() {
            var createTaskFormSubmit = document.getElementById('createTaskFormSubmit')
            createTaskFormSubmit.click();
        },
        submitTask(e) {
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
                }
            })
            console.log(emptyRequiredFields)
            if (emptyRequiredFields.length > 0) {
                // form error
                alert("form error")
            } else {
                var task_data = {
                    name: fieldsValues[0],
                    slug: fieldsValues[1],
                    description: fieldsValues[2],
                    username: self.user.username

                }
                var created = self.createTask(task_data)

                if (created) {
                    this.$bvModal.hide('createTaskModel')
                }
                
            }
        },
        isCreatingModal: function(should_show) {
            this.creatingTask=should_show
            this.showTaskModel=should_show

            this.editingTask=!should_show
        },
        isEditingTask: function(should_show, mod) {
            this.editingTask=should_show
            this.showTaskModel = should_show

            // console.log(mod)
            this.setEditTask(mod)
        },
    },
    computed: mapState({
        savedTasks: state => _.orderBy(state.task.all, ['updatedAt'], ['desc']),
        editingTaskComputed: function() {
            return this.editingTask
        }
    }),
    created: function() {
        this.$store.dispatch('task/getAllTasks')
    },
    mounted: async function() {
        var self = this
        self.user = await self.$parent.getUserData()
        // console.log(self.user)
        // console.log(self.mod.all)
    }
}
</script>
