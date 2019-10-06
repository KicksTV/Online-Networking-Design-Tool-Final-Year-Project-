let pcCounter = 0;

function Computer() {
    pcCounter++
    let state = {
        "imgPath": loadImage('img/pc.svg'),
        "Xpos": 100,
        "Ypos": 100,
        "componentSize": 65,
        "height": 65 / 1.2,
        "componentSizeMin": 65,
        "componentSizeMax": 200,
        "hideComponent": false,
        "isClicked": false,
        gui,
        "componentName": `Computer_${pcCounter}`,
        "textSize": 10,
    }
    return Object.assign(
        state,
        clicker(state),
        componentDisplayer(state),
        mover(state),
        prepareForJson(state),
    );
}