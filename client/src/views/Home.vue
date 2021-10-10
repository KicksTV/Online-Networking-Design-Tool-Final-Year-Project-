<template>
  <div class="home">
    <div class="text-center">
      <div class="video-container">
          <video src="@/assets/vid/frontpage-background-video.mp4" autoplay loop muted></video>
      </div>
      <div class="content">
          <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
              <main role="main" class="inner cover mt-auto">
                  <img class="pb-5" src="@/assets/img/logos/Logo/logo-noborder-white.svg" alt="Build Networks Online - Logo">
                  <!-- <h1 class="cover-heading">Cover your page.</h1> -->
                  <p class="lead">
                      A fast and easy way to prototype your computer networks. Anyone who is interested in learning
                      about networking will find the Online Networking & Learning Tool massively useful as it teaches
                      the nessercary concepts in networking. 
                  </p>
                  <p class="lead">
                      <router-link to="/projects" class="btn btn-lg btn-success mx-2">Start a project</router-link>
                      <a href="#" class="btn btn-lg btn-secondary mx-2">Learn more</a>
                  </p>
              </main>

              <footer class="mastfoot mt-auto">
                  <div class="inner">
                    <p>A <a href="https://www.kingston.ac.uk/">Kingston University</a> Project, by <a href>Llewellyn Brunsdon-Haland</a>. <br> Designed by <a href="http://elizabethzrose.com">Elizabeth Zographia Rose</a>.</p>
                  </div>
              </footer>
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
 .bd-placeholder-img {
    font-size: 1.125rem;
    text-anchor: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  @media (min-width: 768px) {
    .bd-placeholder-img-lg {
        font-size: 3.5rem;
    }
  }
</style>

<script>
// @ is an alias to /src
import '@/assets/css/frontpage.css';

export default {
  name: 'Home',
  components: {
  }
}
</script>
