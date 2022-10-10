import { createStore } from 'vuex'
import mod from './modules/module'

// const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    mod,
  },
  state () {
    return {
    }
  }
  // mutations: {
  //   loadValues (state, prop, obj) {
  //     for (const [key, value] of Object.entries(obj)) {
  //       state[prop][key] = value
  //     }
  //   },
  //   updateField (state, prop, fieldData) {
  //     state[prop][fieldData[0]] = fieldData[1]
  //   }
  // },
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})