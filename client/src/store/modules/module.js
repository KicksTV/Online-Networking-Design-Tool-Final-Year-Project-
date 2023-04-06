import modAPI from '../../api/module'

// initial state
const state = () => ({
  all: [],
  current: {
    id: '',
    name: '',
    slug: '',
    description: '',
    updatedAt: '',
    createdAt: ''
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
  async createModule({ commit }, module) {
    try {
      var mod = await modAPI.apiSaveModule(module)
      commit('pushModule', mod)
      return true
    } catch (e) {
      alert(e)
      return false
    }
  },
  async editModule({ commit }, module) {
    try {
      var mod = await modAPI.apiSaveModule(module)
      commit('editModule', mod)
      return true
    } catch (e) {
      alert(e)
      return false
    }
  },
  async getAllModules({ commit }) {
    const modules = await modAPI.getAllModules()
    commit('setModules', modules)
  },
  async setEditModule({ commit }, module) {
    commit('setCurrent', module)
  }
}
  
// mutations
const mutations = {
  pushModule(state, obj) {
    state.all.push(obj)
  },
  editModule(state, obj) {
    state.all.map(o => o.id === obj.id ? obj : o);
  },
  setModules(state, modules) {
    state.all = modules
  },
  updateField(state, obj) {
    // console.log(state, obj)
    var prop = obj['prop'],
        val = obj['val'];
    state.current[prop] = val
   
  },
  setCurrent(state, mod) {
    state.current = mod
  }
}
  
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}