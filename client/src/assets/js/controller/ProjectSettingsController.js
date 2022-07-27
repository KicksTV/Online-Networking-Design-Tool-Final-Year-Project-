const GUI = require('dat.gui').GUI;

const ProjectSettingsController = (function() {
    var instance;
    
    function init() {
        
        var settings = {
            'id': null,
            'slug': null,
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
            if (s.id) settings.id = s.id
            settings.name = s.name
            settings.creationDate = s.creationDate
            settings.realtimeValidation = s.realtimeValidation
            settings.slug = s.slug

            console.log(s, settings)


            var vueCompCanvas = window.$vue.getVueComponent('Canvas')
            vueCompCanvas.projectName = settings.name
        }
        function gui_fields(val) {
            if (val) {
                _gui_fields = val
            }
            return _gui_fields
        }
        function obj(prop, val) {
            if (prop) {
                if (val) {
                    settings[prop] = val
                } else {
                    return settings[prop]
                }
            } else {
                return settings
            }
        }
        function setID(id) {
            settings.id = id
            return settings
        }
        function getID() {
            return settings.id
        }
        function setSlug(slug) {
            settings.slug = slug
            return settings
        }
        function getSlug() {
            return settings.slug
        }
        function setName(str) {
            settings.name = str
            return settings
        }
        function getName() {
            return settings.name
        }
        function setCreationDate(date) {
            settings.creationDate = date
            return settings
        }
        function getCreationDate() {
            return settings.creationDate
        }
        function setlastEdited(date) {
            settings.lastEdited = date
            return settings
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
            return settings
        }
        function toJSON() {
            return {
                'id': settings.id,
                'slug': settings.slug,
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
            setID:setID,
            getID:getID,
            setSlug:setSlug,
            getSlug:getSlug,
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
