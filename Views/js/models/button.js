function Button(imgPath, imgAlt, compType) {
    let state = {
        text,
        width,
        height,
        imgPath,
        imgAlt,
        "componentType": compType,

        "li": createElement('li', ''),
        "img": createImg(imgPath, imgAlt),
    }
    return Object.assign(
        state,
        buttonDisplayer(state),
    );
}