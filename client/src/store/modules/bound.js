
// initial state
const state = () => ({
    current: {},
    mods: []
  })
  
  // getters
  const getters = {
    async getCurrent (state) {
      return state.current
    }
  }
  
  // actions
  const actions = {
  }
  
  // mutations
  const mutations = {
    setCurrent (state, obj) {
      state.current = obj
    },
    pushModule (state, obj) {
      state.mods.push(obj)
    },
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }