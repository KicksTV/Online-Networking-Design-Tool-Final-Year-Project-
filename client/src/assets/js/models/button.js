import buttonDisplayer from '../behaviors/behaviors.js';

const p5 = require('p5')

export default function Button(name, compType, imgPath, imgAlt) {
    let state = {
        imgPath,
        imgAlt,
        "name": name,
        "componentType": compType,

        "li": p5.createElement('li', ''),
        "img": p5.createImg(imgPath, imgAlt),
    }

    const buttonInitiator = (state) => ({
        init: () => {
            state.img.addClass('componentImg');
            state.img.parent(state.li);
            state.img.attribute('draggable', 'false');
            state.li.style('display', 'inline-block');
            state.li.hide();
            return Object.assign(
                buttonGetterSetter(state),
                buttonDisplayer(state),
                buttonInitiator(state),
            );
        }
    });
    
    const buttonGetterSetter = (state) => ({
        getName: () => {
            return state.name;
        },
        getComponentType: () => {
            return state.componentType;
        },
        setComponentType: (type) => {
            state.componentType = type;
        },
        getImgPath: () => {
            return state.imgPath;
        },
        getLI: () => {
            return state.li;
        },
        getIMG: () => {
            return state.img;
        }
    });

    Object.assign(state);

    return Object.assign(
        buttonGetterSetter(state),
        buttonDisplayer(state),
        buttonInitiator(state),
    );
}