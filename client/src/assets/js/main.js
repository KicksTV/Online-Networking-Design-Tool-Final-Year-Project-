// Controllers
import componentController from './controller/componentController.js';
import ioController from './controller/ioController.js';
import p5Controller from './controller/p5Controller.js';
import saveLoadController from './controller/saveLoadController.js';

window.onload = function() {

    saveLoadController.init();
    componentController.init();
    ioController.init();    
};

p5Controller.createNewCanvas();





