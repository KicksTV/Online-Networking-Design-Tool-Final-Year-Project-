const GUI = require('dat.gui').GUI;

const ProjectSettingsController = (function() {
    var instance;
    
    function init() {
        
        var settings = {
            'name': 'New Project',
            'creationDate': null,
            'lastEdited': null,
            'editors': null,
            'realtimeValidation': false,
        }
        var _gui_fields = ['realtimeValidation'] // eslint-disable-line
        // var projectSettingsPanel = null
        
        function initGUI() {
            var gui = new GUI({ autoPlace: false });
            var con = document.getElementById('canvasDiv');
            console.log(con)
            con.appendChild(gui.domElement);
            gui.width = 400;
            console.log('new gui')
            gui.addFolder("Project settings");
            gui.add(settings, 'realtimeValidation').listen()

        }
        function setSettings(s) {
            settings.name = s.name
            settings.creationDate = s.creationDate
            settings.realtimeValidation = s.realtimeValidation


            var vueCompCanvas = window.$vue.getVueComponent('Canvas')
            vueCompCanvas.projectName = settings.name
        }
        function gui_fields(val) {
            if (val) {
                _gui_fields = val
            }
            return _gui_fields
        }
        function obj() {
            return settings
        }
        function setName(str) {
            settings.name = str
        }
        function getName() {
            return settings.name
        }
        function setCreationDate(date) {
            settings.creationDate = date
        }
        function getCreationDate() {
            return settings.creationDate
        }
        function setlastEdited(date) {
            settings.lastEdited = date
        }
        function getlastEdited() {
            return settings.lastEdited
        }
        function addEditor(editor) {
            settings.editors.push(editor)
        }
        function getEditors() {
            return settings.editors
        }
        function getRealTimeValidation() {
            return settings.realtimeValidation;
        }
        function setRealTimeValidation(val) {
            settings.realtimeValidation = val;
            return instance
        }
        function toJSON() {
            return {
                'name': settings.name,
                'creationDate': settings.creationDate,
                'lastEdited': settings.lastEdited,
                'realtimeValidation': settings.realtimeValidation,
            }
        }
        
        return {
            initGUI:initGUI,
            setSettings:setSettings,
            gui_fields:gui_fields,
            obj:obj,
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
