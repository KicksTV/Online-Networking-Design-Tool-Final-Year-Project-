<template>
  <div class="container mt-5">
    <div class="col-4 offset-4">
      <h1 class="display-5"><strong>Login</strong></h1><br>
        <form class="form" method="POST">
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" class="form-control" type="text" name="username" placeholder="Username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" class="form-control" type="password" name="password" placeholder="Password">
          </div>
          <button class="btn btn-primary" type="submit">Login</button>
        </form>
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
// import axios from "axios";
// @ is an alias to /src
// import HelloWorld from '@/assets/js/HelloWorld.vue'

export default {
  name: 'Login',
  components: {},
  data () {
    return {
       
    }
  },
  methods: {
   
  },
  mounted: function() {
  }
}
</script>
