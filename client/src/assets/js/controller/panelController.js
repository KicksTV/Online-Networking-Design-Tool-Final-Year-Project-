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

        function createNewPanel(title, width, height, pos) {
            let newpanel = new positionPanel(title, width, height, pos);
            let newpanelview = new PanelView(newpanel);

            newpanelview.show();

            allPanels.add(newpanel);
            return newpanel;
        }
        function createNewInfoPanel(title, width, height, pos) {
            let newpanel = new InformationPanel(title, width, height, pos);
            let newpanelview = new InformationPanelView(newpanel);

            newpanelview.createTable();

            let parentPanel = allPanels.getAll().find(p => p.position == "bottom" && p instanceof positionPanel);

            parentPanel.addInformationPanel(newpanel);

            newpanelview.container.parent(bottomPanel.contentContainer);

            newpanelview.show();
            allPanels.add(newpanel);

            return newpanel;
        }
        function updatePanelWithData(comp) {

            var data = allConnections.getConnectionsRelatedToComp(comp);
            panelview.update(data);
        }

        
        return {
            createNewPanel:createNewPanel,
            createNewInfoPanel:createNewInfoPanel,
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
