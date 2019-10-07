function componentsBarLabel (title, width, height) {
    let state = {
        
        "buttons": [],
        title,
        width,
        height,
        "current": false,

        // CREATING NEW HTML ELEMENTS

        "li": createElement('li', ''),
        "a": createA('', this.title),
    }

    return Object.assign(
        state,
        compLabelDisplay(state),
        canBeCurrent(state),
    );
}