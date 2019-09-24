
class Button {
    constructor(imgPath, alt) {
        this.text;
        this.width;
        this.height;
        this.imgPath = imgPath;
        this.imgAlt = alt;

        this.li; 
        this.img;
    }
    display() {
        let li = createElement('li', '');
        let img = createImg(this.imgPath, this.imgAlt);
        
        img.addClass('componentImg');
        img.parent(li);

        this.li = li;
        this.img = img;
    }
    setText(text) {
        this.text = text;
    }
    setImg(img, alt) {
        this.imgPath = img;
        this.imgAlt = alt;
    }
}