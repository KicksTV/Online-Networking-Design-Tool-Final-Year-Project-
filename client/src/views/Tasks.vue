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
        <b-modal ref="createTask" v-model="showTaskModel" id="createTaskModel" title="Task settings" size="xl">
            <form id="createTaskForm" @submit.prevent="submitTask">
                <button id="createTaskFormSubmit" type="submit" class="d-none"></button>
                <div class="modal-body">
                    <input type="hidden" name="task_id" v-model="currentTask.id">
                    <input type="hidden" name="module_id" v-model="currentTask.moduleID">
                    <input type="hidden" name="module_slug" v-model="module_slug">

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="project_name">Name</span>
                        </div>
                        <bound-input v-bind:current="currentTask"  
                                     :isEditing="editingTaskComputed" 
                                     @update-value="taskUpdateValue"
                                     module='task' name="task_name" 
                                     _type="text" class="form-control" 
                                     :_required="true" ariaLabel="task_name" 
                                     ariaDescribedby="task_name"></bound-input>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="project_name">Slug</span>
                        </div>
                        <bound-input v-bind:current="currentTask"
                                     :isEditing="editingTaskComputed"
                                     @update-value="taskUpdateValue" 
                                     module='task' :name="'task_slug'" 
                                     _type="text" class="form-control" 
                                     :required="true" :ariaLabel="'task_slug'" 
                                     :ariaDescribedby="'task_slug'"></bound-input>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="project_name">Description</span>
                        </div>
                        <bound-input v-bind:current="currentTask" 
                                     :isEditing="editingTaskComputed"
                                     @update-value="taskUpdateValue" 
                                     module='task' :name="'task_description'" 
                                     _type="text" :class="'form-control'" 
                                     :required="true" :ariaLabel="'task_description'" 
                                     :ariaDescribedby="'task_description'"></bound-input>
                    </div>

                    <codemirror ref="codemirror" v-model="currentTask.code" :options="cmOptions" @cursorActivity="onCmCursorActivity" @ready="onCmReady" @focus="onCmFocus" @blur="onCmBlur"></codemirror>
                </div>
            </form>
            <template #modal-footer>
                <div class="w-100">
                    <b-button
                        variant="primary"
                        size="sm"
                        class="float-right"
                        @click="submitForm()" v-html="editingTask ? 'Save edit' : 'Create'">
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

import { codemirror } from 'vue-codemirror'

// base style
import 'codem/lib/codemirror.css'

// language
import 'codem/mode/javascript/javascript.js'

// active-line.js
import 'codem/addon/selection/active-line.js'

// styleSelectedText
import 'codem/addon/selection/mark-selection.js'
import 'codem/addon/search/searchcursor.js'

// highlightSelectionMatches
import 'codem/addon/scroll/annotatescrollbar.js'
import 'codem/addon/search/matchesonscrollbar.js'
import 'codem/addon/search/searchcursor.js'
import 'codem/addon/search/match-highlighter.js'

// keyMap
import 'codem/mode/clike/clike.js'
import 'codem/addon/edit/matchbrackets.js'
import 'codem/addon/comment/comment.js'
import 'codem/addon/dialog/dialog.js'
import 'codem/addon/dialog/dialog.css'
import 'codem/addon/search/searchcursor.js'
import 'codem/addon/search/search.js'
import 'codem/keymap/emacs.js'

// foldGutter
import 'codem/addon/fold/foldgutter.css'
import 'codem/addon/fold/brace-fold.js'
import 'codem/addon/fold/comment-fold.js'
import 'codem/addon/fold/foldcode.js'
import 'codem/addon/fold/foldgutter.js'
import 'codem/addon/fold/indent-fold.js'
import 'codem/addon/fold/markdown-fold.js'
import 'codem/addon/fold/xml-fold.js'

// theme css
import 'codem/theme/monokai.css'

import boundInput from '@/components/boundInput.vue'
// import boundSelect from '@/components/boundSelect.vue'


// mixins
import filterSortMixin from '@/mixins/filterSortMixin.vue'

const _ = require('lodash');

export default {
    name: 'Tasks',
    components: {
        'codemirror': codemirror,
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
            module_slug: null,

            code: 'const a = 10',
            cmOptions: {
                tabSize: 4,
                foldGutter: true,
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                mode: 'text/javascript',
                theme: "monokai",
                extraKeys: {
                    'F11'(cm) {
                        cm.setOption("fullScreen", !cm.getOption("fullScreen"))
                    },
                    'Esc'(cm) {
                        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false)
                    },
                    "Ctrl": "autocomplete"
                }
            }
        }
    },
    methods: {
        ...mapActions('task', [
            'createTask',
            'createCurrentTask',
            'editTask',
            'getAllTasks',
            'setEditTask',
            'updateField'
        ]),

        onCmCursorActivity(codemirror) {
            console.debug('onCmCursorActivity', codemirror)
        },
        onCmReady(codemirror) {
            console.debug('onCmReady', codemirror)
        },
        onCmFocus(codemirror) {
            console.debug('onCmFocus', codemirror)
        },
        onCmBlur(codemirror) {
            console.debug('onCmBlur', codemirror)
        },

        submitForm: function() {
            var createTaskFormSubmit = document.getElementById('createTaskFormSubmit')
            createTaskFormSubmit.click();
        },
        submitTask(e) {
            var self = this;
            var form = e.target
            var requiredFields = []
            var emptyRequiredFields = []
            var fieldsValues = {}
            form.querySelectorAll('input').forEach((el) => {
                if (el.getAttribute("required")) {
                    requiredFields.push(el)
                    if (el.value !== '') {
                        fieldsValues[el.name] = el.value
                    } else {
                        emptyRequiredFields.push(el)
                    }
                } else {
                    fieldsValues[el.name] = el.value
                }
            })
            console.log(fieldsValues, emptyRequiredFields)
            if (emptyRequiredFields.length > 0) {
                // form error
                alert("form error")
            } else {
                var task_data = {
                    id: fieldsValues['task_id'],
                    module_id: fieldsValues['module_id'],
                    module_slug: this.creatingTask ? fieldsValues['module_slug'] : null,
                    name: fieldsValues['task_name'],
                    slug: fieldsValues['task_slug'],
                    description: fieldsValues['task_description'],
                    code: fieldsValues['codemirror'],
                    username: self.user.username
                }

                console.log(task_data)
                
                task_data = this.currentTask

                task_data.module_slug = self.module_slug
                task_data.username = self.user.username
                
                if (self.creatingTask) {
                    var created = self.createTask(this.currentTask)
                } else {
                    // editing module
                    var edited = self.editTask(task_data)
                }

                if (created || edited) {
                    this.$bvModal.hide('createTaskModel')
                }
                
            }
        },
        isCreatingModal: function(should_show) {
            this.creatingTask=should_show
            this.showTaskModel=should_show

            this.editingTask=!should_show

            setTimeout(() => {
                console.log(this.$refs)
                this.$refs.codemirror.refresh()
            }, 200);
        },
        isEditingTask: function(should_show, task) {
            this.editingTask=should_show
            this.showTaskModel = should_show
            // console.log(mod)
            this.setEditTask(task)

            setTimeout(() => {
                console.log(this.$refs)
                this.$refs.codemirror.refresh()
            }, 200);
        },
        taskUpdateValue: function(e) {
            var self = this,
                value = e.target.value;
            var name = e.target.name.split('_')[1]
            // console.log("here", value)
            self.$store.commit(`task/updateField`, {'prop': name, 'val': value})
        }
    },
    computed: mapState({
        savedTasks: state => _.orderBy(state.task.all, ['updatedAt'], ['desc']),
        editingTaskComputed: function() {
            return this.editingTask
        },
        currentTask: function() {
            return this.$store.getters[`task/getCurrent`]
        },
    }),
    created: function() {
        this.$store.dispatch('task/getAllTasks')
    },
    mounted: async function() {
        var self = this
        self.user = await self.$parent.getUserData()
        // console.log(self.user)
        // console.log(self.mod.all)
        console.log(this)

        this.module_slug = this.$root._route.params.module
    }
}
</script>
