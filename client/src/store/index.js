import Vuex from 'vuex'
import mod from './modules/module'
import task from './modules/task'
import bound from './modules/bound'

import {newVue} from '../router'

newVue.use(Vuex)

export default new Vuex.Store({
  modules: {
    mod,
    task,
    bound
  },
  state: {
  },
})