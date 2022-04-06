<template>
  <div>
    <ComponentBar></ComponentBar>
    <Canvas></Canvas>
    <BottomPanel></BottomPanel>
  </div>
</template>

<script>
  // @ is an alias to /src
  import ComponentBar from '@/components/ComponentBar.vue'
  import Canvas from '@/components/Canvas.vue'
  import BottomPanel from '@/components/BottomPanel.vue'
  // import p5 from '@/components/p5.vue'

  export default {
    name: 'NewProject',
    components: {
      ComponentBar,
      Canvas,
      BottomPanel,
      // p5
    },
    mounted() {
        var self = this;

        console.log(self)

    },
  }
</script>