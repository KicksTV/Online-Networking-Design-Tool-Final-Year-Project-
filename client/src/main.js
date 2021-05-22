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
  router,
  render: h => {

    // Which templete to use
    for (var r of router.options.routes) {
      if (r.path == router.apps[0]._route.path) {
        if (r.template == "App") 
          return h(App)
        else if (r.template == "Index") 
          return h(Index)
      }
    }
  },
  methods: {
    makeToast(title, msg, append = false) {
      this.$root.$bvToast.toast(msg, {
        title: title,
        autoHideDelay: 5000,
        appendToast: append
      })
    }
  },
}).$mount('#app')

window.$vue = vue

