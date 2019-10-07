let routerCounter = 0;

function Router() {
    routerCounter++
    let state = {
        "imgPath": loadImage('img/router.svg'),
        "Xpos": 100,
        "Ypos": 100,
        "componentSize": 65,
        "height": 65 / 1.2,
        "componentSizeMin": 65,
        "componentSizeMax": 200,
        "hideComponent": false,
        "isClicked": false,
        gui,
        "componentName": `Router_${routerCounter}`,
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