function Button(imgPath, imgAlt, compType) {
    let state = {
        text,
        width,
        height,
        imgPath,
        imgAlt,
        "componentType": compType,
    }
    return Object.assign(
        state,
        buttonDisplayer(state),
    );
}