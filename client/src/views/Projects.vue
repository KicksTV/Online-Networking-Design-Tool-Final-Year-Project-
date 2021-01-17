<template>
  <div class="container-fluid">
    <h1 class="display-4"><strong>Create or load a project</strong></h1><br>
    <div class="card-deck">
        <a href="/projects/newproject" style="text-decoration: none;">
            <div class="card" style="width: 18rem;">
                <img class="" src="../assets/img/add.png" style="margin: 20px;" width="50px" height="50px" alt="Image of plus icon">
                <div class="card-body">
                    <h5 class="card-title">New Project</h5>
                    <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                    <!-- <a href="/projects/newproject" class="btn btn-primary"></a> -->
                </div>
                
            </div>
        </a>
        <a class="disabled" style="text-decoration: none;">
            <div class="card" style="width: 18rem;">
                <img class="" src="../assets/img/add.png" style="margin: 20px;" width="50px" height="50px" alt="Image of plus icon">
                <div class="card-body">
                    <h5 class="card-title">Load Project</h5>
                    <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                    <!-- <a href="/projects/newproject" class="btn btn-primary"></a> -->
                </div>
                
            </div>
        </a>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Projects',
  components: {
    
  }
}
</script>
