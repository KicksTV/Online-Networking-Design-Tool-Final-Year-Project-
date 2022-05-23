<template>
  <div id="app">
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <router-link to="/" class="navbar-brand">
      <b-navbar-brand>
        <img src="./assets/img/logo/logo-icon-noborder-white.svg" width="44px" height="37.5px" alt="" loading="lazy">
        Build Networks Online
      </b-navbar-brand>
    </router-link>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">
          <router-link to="/projects" class="nav-link">Projects <span class="sr-only">(current)</span></router-link>
        </b-nav-item>
        <b-nav-item href="#" disabled>
          <router-link to="/about" class="nav-link">How to use</router-link>
        </b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <!-- <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown> -->
        <b-nav-item-dropdown right v-if="getUser">
          <template #button-content>
            <i class="fas fa-user mr-2"></i>
            <em>{{ getUserName }} </em>
          </template>
          <!-- <b-dropdown-item href="#">Profile</b-dropdown-item> -->
          <b-dropdown-item href="/logout">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
        <div right v-else>
          <a href="/login">Login</a>
          <span class="text-white">/</span>
          <a href="/register">Sign up</a>
        </div>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <router-view/>
  </div>
</template>

<script>
  export default {
      name: "App",
      props: {

      },
      data: function() {
        return {
          user: null,
        }
      },
      methods: {
          getUserData: function() {
            var self = this
            console.log(self.$parent.HTTP)
            self.$parent.HTTP.get('api/user/get/session/')
                  .then(response => {
                    console.log(response)
                    if (response.data) {
                      self.user = response.data
                    }
                    this.loading = false
                  })
                  .catch(error => {
                    console.log(error)
                    this.errored = true
                    this.loading = false
                    return null
                  })
                  .finally(() => this.loading = false)
            
          },
          
      },
      computed: {
        getUser: function() {
          console.log(this.user)
          return this.user
        },
        getUserName: function() {
          if (this.user)
            return this.user.username
          else
            return null
        }
      },
      mounted: function() {
        this.getUserData()
      }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* #nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
