<template>
  <div class="container mt-5">
    <div class="col-4 offset-4">
        <h1 class="display-5"><strong>Register</strong></h1><br>
        <form class="form" method="POST">
            <input class="form-control" type="text" name="username" placeholder="Username">
            <input class="form-control" type="password" name="password" placeholder="Password">
            <button class="btn btn-primary" type="submit">Go</button>
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
  name: 'Register',
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
