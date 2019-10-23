let routerCounter = 0;

function Router() {
    routerCounter++
    let state = {
        "imgPath": loadImage('img/router.svg'),
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
        "componentName": `Router_${routerCounter}`,
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