class Button {
    constructor() {
        this.text;
        this.width;
        this.height;
        this.imgPath;
        this.imgAlt;

    }
    display() {
        var div = createDiv();
        var compImg = createImg(this.imgPath, );

        div.addClass();
        div.parent('components');

        compImg.addClass('componentImg');
        compImg.parent(div);
    }
    setText(text) {
        this.text = text;
    }
    setImg(img, alt) {
        this.imgPath = img;
        this.imgAlt = alt;
    }
}