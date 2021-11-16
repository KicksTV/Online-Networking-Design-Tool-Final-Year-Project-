import App from './App.vue'
import Index from './Index.vue'

import {router, newVue} from './router'

import PortalVue from 'portal-vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

newVue.use(PortalVue)

// Make BootstrapVue available throughout your project
newVue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
newVue.use(IconsPlugin)

newVue.config.productionTip = false


const vue = new newVue({
  data () {
    return {
        foundVueComp: null,
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
      this.$root.$bvToast.toast(msg, {
        title: title,
        autoHideDelay: 5000,
        appendToast: append
      })
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
      arrToIterate.forEach((vuecomp) => {
        // console.log("Looking at: ", vuecomp)
        if (vuecomp.$children) {
          // console.log(vuecomp)
          if (vuecomp.$vnode) {
            var vuecompName = vuecomp.$vnode.tag.split('-')[3]
            // console.log(vuecompName)
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
  },
}).$mount('#app')

window.$vue = vue

