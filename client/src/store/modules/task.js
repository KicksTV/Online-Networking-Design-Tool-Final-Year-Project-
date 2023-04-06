import taskAPI from '../../api/task'

// initial state
const state = () => ({
  all: [],
  current: {
    id: '',
    name: '',
    slug: '',
    description: '',
    updatedAt: '',
    createdAt: '',
    module_slug: '',
    code: ''
  },
})
  
// getters
const getters = {
  getCurrent(state) {
    return state.current
  }
}
  
// actions
const actions = {
  async createTask({ commit }, task) {
    try {
      var t = await taskAPI.apiSaveTask(task)
      commit('pushTask', t)
      return true
    } catch (e) {
      alert(e)
      return false
    }
  },
  async editTask({ commit }, task) {
    try {
      var t = await taskAPI.apiSaveTask(task)
      commit('editTask', t)
      return true
    } catch (e) {
      alert(e)
      return false
    }
  },
  async getAllTasks({ commit }) {
    const tasks = await taskAPI.getAllTasks()
    commit('setTasks', tasks)
  },
  async setEditTask({ commit }, task) {
    commit('setCurrent', task)
  }
}
  
// mutations
const mutations = {
  pushTask(state, obj) {
    state.all.push(obj)
  },
  editTask(state, obj) {
    state.all.map(o => o.id === obj.id ? obj : o);
  },
  setTasks(state, tasks) {
    state.all = tasks
  },
  updateField(state, obj) {
    // console.log(state, obj)
    var prop = obj['prop'],
        val = obj['val'];
    state.current[prop] = val
   
  },
  setCurrent(state, task) {
    state.current = task
  }
}
  
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}