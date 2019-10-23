let pcCounter = 0;

function Computer() {
    pcCounter++;
    let state = {
        "imgPath": loadImage('img/pc.svg'),
        "Xpos": 100,
        "Ypos": 100,
        "width": 65,
        "height": 65 / 1.2,
        "widthMin": 65,
        "widthMax": 200,
        "centerPos": [],
        "hideComponent": false,
        "isClicked": false,
        gui,
        "componentName": `Computer_${pcCounter}`,
        "textSize": 10,
    }

    Object.assign(
        state,
        getterSetter(state),
    );

    return Object.assign(
        clicker(state),
        componentDisplayer(state),
        mover(state),
        prepareForJson(state),
        getterSetter(state),
    );
}