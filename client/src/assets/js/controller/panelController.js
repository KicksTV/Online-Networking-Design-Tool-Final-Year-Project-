// NOT BEING USED!!!!!


// Collections
import allConnections from '../collections/allConnections.js';

// Views
import PanelView from '../views/PanelView.js';

const panelController = (function() {
    var instance;
    
    function init() {
     
        // dat.GUI
        // var networkPropertiesPanel = null;
        var panelview =  new PanelView();

        
        function updatePanelWithData(comp) {

            var data = allConnections.getConnectionsRelatedToComp(comp);
            panelview.update(data);
        }

        
        return {
            updatePanelWithData:updatePanelWithData,
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

export default panelController;
