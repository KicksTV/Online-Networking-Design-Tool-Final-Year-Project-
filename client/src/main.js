import App from './App.vue'
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
  render: h => h(App),

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

