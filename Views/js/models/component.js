let counter = 0;

function Component(type, path, image) {
    counter++
    let state = {
        "imgPath": path,
        "image": image,
        "type": type,
        "Xpos": 100,
        "Ypos": 100,
        "width": 0,
        "height": 0,
        "widthMin": 65,
        "widthMax": 200,
        "centerPos": [],
        "hideComponent": false,
        "hideConnections": false,
        "isClicked": false,
        "gui": null,
        "componentName": `${type}_${counter}`,
        "textSize": 10,
        "guiParams": null,
    }

    const componentInitiator = (state) => ({
        init: () => {
            state.width = state.image.width/2;
            state.height = state.image.height/2;
            return Object.assign(
                componentInitiator(state),
                clicker(state),
                componentDisplayer(state),
                mover(state),
                prepareForJson(state),
                getterSetter(state),
            );;
        }
    });

    Object.assign(
        state,
        getterSetter(state),
    );

    return Object.assign(
        componentInitiator(state),
        clicker(state),
        componentDisplayer(state),
        mover(state),
        prepareForJson(state),
        getterSetter(state),
    );
    
}