const ProjectSettingsController = (function() {
    var instance;
    
    function init() {

        var name = 'New Project';
        var creationDate = null;
        var lastEdited = null;
        var editors = null;
        
        function setSettings(settings) {
            name = settings.name
            creationDate = settings.creationDate
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
        function toJSON() {
            return {
                'name': name,
                'creationDate': creationDate,
                'lastEdited': lastEdited,
            }
        }
        
        return {
            setSettings:setSettings,
            setName:setName,
            getName:getName,
            setCreationDate:setCreationDate,
            getCreationDate:getCreationDate,
            setlastEdited:setlastEdited,
            getlastEdited:getlastEdited,
            addEditor:addEditor,
            getEditors:getEditors,
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
