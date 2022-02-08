
<script>
    /* eslint-disable */
    const GUI = require('dat.gui').GUI;

    export default {
        name: "Gui",
        props: {
            
        },
        data() {
            return {
                datgui: new GUI({ name: 'test', autoPlace: true, resizable: true }),
                folders: {},
                showing: false,
            }
        },
        methods: {
            init: function(parent) {
                var self = this,
                    con = document.getElementById("rightSidePanel");
                con.appendChild(self.datgui.domElement)
                self.datgui.width = 400
            },
            addFolder: function(controller, projectName, start_open) {
                var self = this
                self.folder = self.datgui.addFolder(projectName)
                self.addFields(controller)
                if (start_open)
                    self.folder.open()
            },
            addFields: function(controller) {
                var self = this,
                    obj = controller.obj();
                for (const prop of controller.gui_fields()) {
                    console.log(prop)
                    self.folder.add(obj, prop).listen()
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
            
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>