<template>
  <div id="app">
    <div class="text-center">
      <div class="content">
        <div class="cover-container d-flex w-100 p-3 mx-auto flex-column">
          <header class="masthead mb-auto">
              <div class="inner">
                  <!-- <a class="navbar-brand" href="#">
                      <img src="/assets/img/logos/Symbol/No border-11.svg" width="44" height="37.5" alt="" loading="lazy">
                  </a> -->
                  <!-- <h3 class="masthead-brand">Build Networks Online</h3> -->
                  <nav class="nav nav-masthead justify-content-center">
                      <router-link to="/" class="nav-link active">Home</router-link>
                      <router-link to="/projects" class="nav-link">Projects</router-link>
                      <a class="nav-link" href="#">Documentation</a>
                      <a class="nav-link" href="#">About</a>
                  </nav>
              </div>
          </header>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.cover-container {
  z-index: 100;
  height: 100px;
}

/* #nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
