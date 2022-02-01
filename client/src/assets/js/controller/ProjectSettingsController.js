const GUI = require('dat.gui').GUI;

const ProjectSettingsController = (function() {
    var instance;
    
    function init() {
        
        var name = 'New Project';
        var creationDate = null;
        var lastEdited = null;
        var editors = null;
        var realtimeValidation = false;
        
        function initGUI() {
            var gui = new GUI({ autoPlace: false });
            var con = document.getElementsByClassName('p5Canvas')[0];
            con.appendChild(gui.domElement);
            gui.width = 400;
            console.log('new gui')
            gui.add(realtimeValidation).listen()

        }
        function setSettings(settings) {
            name = settings.name
            creationDate = settings.creationDate
            realtimeValidation = settings.realtimeValidation


            var vueCompCanvas = window.$vue.getVueComponent('Canvas')
            vueCompCanvas.projectName = name
        }
        function setName(str) {
            name = str
        }
        function getName() {
            return name
        }
        function setCreationDate(date) {
            creationDate = date
        }
        function getCreationDate() {
            return creationDate
        }
        function setlastEdited(date) {
            lastEdited = date
        }
        function getlastEdited() {
            return lastEdited
        }
        function addEditor(editor) {
            editors.push(editor)
        }
        function getEditors() {
            return editors
        }
        function getRealTimeValidation() {
            return realtimeValidation;
        }
        function setRealTimeValidation(val) {
            realtimeValidation = val;
            return instance
        }
        function toJSON() {
            return {
                'name': name,
                'creationDate': creationDate,
                'lastEdited': lastEdited,
                'realtimeValidation': realtimeValidation,
            }
        }
        
        return {
            initGUI:initGUI,
            setSettings:setSettings,
            setName:setName,
            getName:getName,
            setCreationDate:setCreationDate,
            getCreationDate:getCreationDate,
            setlastEdited:setlastEdited,
            getlastEdited:getlastEdited,
            addEditor:addEditor,
            getEditors:getEditors,
            getRealTimeValidation,
            setRealTimeValidation,
            toJSON:toJSON,
        };   
    }
    return {
        getInstance: () => {
            if (!instance) {
                instance = init();
            }

            return instance
        }
    }
})();

export default ProjectSettingsController.getInstance();
