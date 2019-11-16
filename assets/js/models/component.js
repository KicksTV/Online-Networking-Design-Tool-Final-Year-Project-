let counter = 0;

function Component(type, path, image) {
    counter++
    let state = {
        "id": null,
        "imgPath": path,
        "image": image,
        "type": type,
        "Xpos": 100,
        "Ypos": 100,
        "aspectRatio": [],
        "centerPos": [],
        "hideComponent": false,
        "hideConnections": false,
        "hasConnection": false,
        "isClicked": false,
        "componentName": `${type}_${counter}`,
        "textSize": 10,
        "guiParams": null,
    }

    const componentInitiator = (state) => ({
        init: () => {
            var val = Math.floor(1000 + Math.random() * 900000);
            state.id = `${state.componentName}${val}`;
            
            state.aspectRatio[0] = state.image.width;
            state.aspectRatio[1] = state.image.heigt;
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