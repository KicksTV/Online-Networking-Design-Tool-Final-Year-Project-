
<template><div></div></template>
<script>
    // const GUI = require('dat.gui').GUI;

    // ES6:
    import * as dat from '/dat.gui';
    // const GUI = require('datgui2').GUI;


    export default {
        name: "Gui",
        props: {
            
        },
        data() {
            return {
                datgui: new dat.GUI({ name: 'test', autoPlace: true, resizable: true,  }),
                folders: {},
                showing: false,
            }
        },
        methods: {
            init: function(parent) {
                var self = this,
                    con = document.getElementById(parent);
                con.appendChild(self.datgui.domElement)
                self.datgui.width = 400
            },
            addFolder: function(controller, projectName, start_open) {
                var self = this
                var folder = self.datgui.addFolder(projectName)
                var project_name = projectName.replace(' ', '_')
                self.folders[project_name] = folder
                self.addFields(controller, project_name)
                if (start_open)
                    folder.open()
            },
            addFields: function(controller, project_name) {
                var self = this,
                    obj = controller.obj(),
                    folder = self.folders[project_name];
                for (const prop of controller.gui_fields()) {
                    console.log(prop)
                    var field = folder.add(obj, prop).listen()
                    field.onChange(function(value) {
                        // Fires on every change, drag, keypress, etc.
                        controller.obj(prop, value)
                        console.log(controller.obj())
                    });
                }
            },
            show: function() {
                this.datgui.show()
            },
            hide: function() {
                this.datgui.hide()
            }

        },
        mounted() {
            var self = this;

            
            self.$vnode = {
                tag: "vue-component-9000-Gui"
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>