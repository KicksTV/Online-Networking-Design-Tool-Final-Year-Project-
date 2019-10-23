function Connection(type) {

    let state = {
        "type": type,
        "mousePos": [0, 0],
        components: [],
    }

    const connectionBehavior = (state) => ({
        getType: () => {
            return state.type;
        },
        setType: (type) => {
            state.type = type;
        },
        getMousePos: () => {
            return state.mousePos;
        },
        setMousePos: (x, y) => {
            state.mousePos = [x, y];
        },
        addComponent: (comp) => {
            state.components.push(comp);
        },
        getComponents: () => {
            return state.components;
        },
        compSelectDisplay: () => {
            centerPos = state.components[0].getCenterPos();
            x = centerPos[0];
            y = centerPos[1];
            strokeWeight(2);
            line(x, y, state.mousePos[0], state.mousePos[1]);
        },
        defaultDisplay: () => {
            centerPos1 = state.components[0].getCenterPos();
            centerPos2 = state.components[1].getCenterPos();
            x1 = centerPos1[0];
            y1 = centerPos1[1];
            x2 = centerPos2[0];
            y2 = centerPos2[1];
            line(x1, y1, x2, y2);
        }
    });

    Object.assign(state);

    return Object.assign(connectionBehavior(state));
}