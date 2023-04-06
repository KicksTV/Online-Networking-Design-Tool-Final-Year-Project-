import App from './App.vue'
import Index from './Index.vue'
import store from './store'

import {router, newVue} from './router'

import PortalVue from 'portal-vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

const _ = require('lodash');

newVue.use(PortalVue)

// Make BootstrapVue available throughout your project
newVue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
newVue.use(IconsPlugin)

newVue.config.productionTip = false


const axios = require('axios').default;

const HTTP = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
})


const vue = new newVue({
  store: store,
  data () {
    return {
      HTTP: HTTP,
      foundVueComp: null,
      toastQueue: []
    }
  },
  router,
  render: h => {

    // Which templete to use
    if (router.apps[0]._route.path == '/') {
      return h(Index)
    } else {
      return h(App)
    }
  },
  methods: {
    isDevelopment: () => process.env.NODE_ENV == 'development',
    isProduction: () => process.env.NODE_ENV == 'production',
    makeToast(title, msg, append = false) {
      var self = this,
          toast = {title, msg},
          hideDelay = 5000;
      // console.log(!self.toastQueue.find(x => { return _.isEqual(x, toast)} ))
      if (!self.toastQueue.find(x => {return _.isEqual(x, toast)} )) {
        this.$root.$bvToast.toast(msg, {
          title: title,
          autoHideDelay: hideDelay,
          appendToast: append
        })
        self.toastQueue.push(toast)
        window.setTimeout(function() {
          // var item_to_delete = self.toastQueue.find(x => {return _.isEqual(x, toast)} )
          // console.log("Deleting item from queue", item_to_delete)
          self.toastQueue.shift()
        }, hideDelay)
      }
      console.log(self.toastQueue)
    },
    // Vue component or page
    getVueComponent(name) {
      var self = this
      let foundVueComp = self.findComponent(self.$children, name)
      self.$children
      // console.log("returning again: ", foundVueComp)
      return foundVueComp
    },
    findComponent(arrToIterate, name) {
      var self = this
      // console.log("Looking through: ", arrToIterate)
      if (arrToIterate.length) {
        arrToIterate.forEach((vuecomp) => {
          // console.log(vuecomp.$vnode.tag)
          // console.log("Looking at: ", vuecomp)
          if (vuecomp.$children) {
            if (vuecomp.$vnode) {
              var vuecompName = vuecomp.$vnode.tag.split('-')[3]
              // console.log(vuecompName)
              // console.log(vuecomp)
              if (vuecompName == name) {
                // console.log("Found vuecomp: ", vuecomp)
                self.foundVueComp = vuecomp
                return
              }
            }
            self.findComponent(vuecomp.$children, name)
          }
        })
        if (self.foundVueComp) {
          // console.log("Returning vuecomp: ", self.foundVueComp)
          return self.foundVueComp
        }
      }
    }
  },
  mounted: function() {
  }
}).$mount('#app')

window.$vue = vue

export default vue

