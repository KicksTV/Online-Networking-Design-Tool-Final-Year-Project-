<template>
  <div class="container mt-5">
    <div class="col-4 offset-4">
        <h1 class="display-5"><strong>Register</strong></h1><br>
        <form ref="form" class="form" method="POST" @submit.prevent="formSubmit">
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" class="form-control" type="text" name="username" placeholder="Username">
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" class="form-control" type="email" name="email" placeholder="Email">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input ref="password" id="password" class="form-control" type="password" name="password" placeholder="Password">
          </div>
          <div class="form-group">
            <label for="retype_password">Retype Password</label>
            <input ref="retype_password" id="retype_password" class="form-control" type="password" name="retype_password" placeholder="Retype Password">
          </div>
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
    formSubmit: function() {
      var pass = this.$refs.password,
          retype_pass = this.$refs.retype_password;

      if (pass.value !== retype_pass.value) {
        alert('Password does do not match, please try again.')
      } else {
        this.$refs.form.submit()
      }

    }
  },
  mounted: function() {
  }
}
</script>
