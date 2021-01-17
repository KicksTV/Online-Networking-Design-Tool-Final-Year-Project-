<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-dark" style="justify-content: space-between;">
      <router-link to="/" class="navbar-brand">
        <img src="./assets/img/logo/logo-icon-noborder-white.svg" width="44px" height="37.5px" alt="" loading="lazy">
        Build Networks Online
      </router-link>
      <div class="form-inline">
        <button class="navbar-toggler" style="padding: .25rem .5rem;font-size: .875rem;" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto" style="flex-direction: row;">
          <li class="nav-item active">
            <router-link to="/projects" class="nav-link">Projects <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link">How to use</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

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
