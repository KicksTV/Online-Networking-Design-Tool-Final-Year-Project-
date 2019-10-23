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

    Object.assign(state);

    return Object.assign(
        buttonGetterSetter(state),
        buttonDisplayer(state),
    );
}