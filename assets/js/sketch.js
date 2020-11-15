// Controllers
import p5Controller from './controller/p5Controller.js';
import saveLoadController from './controller/saveLoadController.js';

window.onload = function() {

    var canvasDeleteButton = document.getElementById("canvasDeleteButton");
    var canvasLoadProject = document.getElementById("canvasLoadProject");
    var canvasSaveProject = document.getElementById("canvasSaveProject");


    // LOAD
    var input = document.getElementById("upload_input");
    canvasLoadProject.addEventListener("click", () => {
        input.click();
    });
    input.onchange = saveLoadController.loadEvent;

    // SAVE
    canvasSaveProject.addEventListener("click", saveLoadController.saveEventToFile);

    // DELETE COMPONENT
    canvasDeleteButton.addEventListener("click", () => {
        compContrInstance.setSelectCompForDelete(true);
    });

    var createRoomButton = document.getElementById("createRoom");
    createRoomButton.addEventListener("click", () => {
        ioController.getInstance().sendData('createRoom', ioController.getInstance().getSocket().id);
        console.log(`Your room id: ${ioController.getInstance().getSocket().id}`);
        
        alert(`Your room id: ${ioController.getInstance().getSocket().id}`);

        // Hide create room button
        createRoomButton.style.display = "none";
    });;
};

p5Controller.createNewCanvas();





