<template>
  <div>
    <vue-p5 @preload="preload"
        @setup="setup"
        @draw="draw"
        @keypressed="keyPressed"
        @mousemoved="mouseMoved"
        @mousedragged="mouseDragged"></vue-p5>
  </div>
</template>

<script>
    import Vue from 'vue'; // eslint-disable-line
    import VueP5 from 'vue-p5';

    export default {
        name: "p5",
        components: {
            "vue-p5": VueP5
        },
        data() {
            return {
                img: null,
            }
        },
        methods: {
            preload(sketch) {
                var self = this;
                self.img = sketch.loadImage('../img/wireless-access-point.svg')

                console.log(self.img)
            },
            setup(sketch) {
                sketch.createCanvas(400, 400);
                sketch.background('green');
                sketch.text('Hello p5!', 20, 20);
            },
            draw(sketch) {
                var self = this;
                sketch.image(self.img, 50, 50)
            },
        },
    };
</script>