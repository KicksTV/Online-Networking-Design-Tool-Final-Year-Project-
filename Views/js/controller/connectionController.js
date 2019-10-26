function drawAllConnections() {
    if (allCons.getSelectingSecondConnection()) {
        allCons.get().forEach((i) => {
            i.compSelectDisplay();
        });
    }else {
        allCons.get().forEach((i) => {
            if (i != allCons.getSelectedConnection()) {
                i.defaultDisplay();
            }
        });
    }
}