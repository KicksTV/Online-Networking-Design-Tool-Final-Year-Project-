<template>
  <div>
    <ComponentBar></ComponentBar>
    <Canvas></Canvas>
  </div>
</template>

<script>
// @ is an alias to /src
import ComponentBar from '@/components/ComponentBar.vue'
import Canvas from '@/components/Canvas.vue'

export default {
  name: 'NewProject',
  components: {
    ComponentBar,
    Canvas
  }
}
</script>