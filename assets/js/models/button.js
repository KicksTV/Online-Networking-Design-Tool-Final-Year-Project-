import buttonDisplayer from '../behaviors/behaviors.js';

export default function Button(name, compType, imgPath, imgAlt) {
    let state = {
        text,
        width,
        height,
        imgPath,
        imgAlt,
        "name": name,
        "componentType": compType,

        "li": createElement('li', ''),
        "img": createImg(imgPath, imgAlt),
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