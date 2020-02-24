let counter = 0;
function Component(type, path, image) {
    counter++
    let state = {
        "id": null,
        "imgPath": path,
        "image": image,
        "type": type,
        "Xpos": 100,
        "Ypos": 100,
        "aspectRatio": [],
        "centerPos": [],
        "hideComponent": false,
        "hideConnections": false,
        "hasCon": false,
        "isClicked": false,
        "componentName": `${type}_${counter}`,
        "textSize": 10,
        "guiParams": null,
        "validLinkingComponents": ["Twisted Pair"],
        "interfaces": [],
    }

    const componentInitiator = (state) => ({
        init: () => {
            var val = Math.floor(1000 + Math.random() * 900000);
            state.id = `${state.componentName}${val}`;
            
            state.aspectRatio[0] = state.image.width;
            state.aspectRatio[1] = state.image.heigt;

            //print(state);
            return Object.assign(
                componentInitiator(state),
                clicker(state),
                componentDisplayer(state),
                mover(state),
                prepareForJson(state),
                getterSetter(state),
            );;
        }
    });
    // COMPONENTS METHODS

    const getterSetter = (state) => ({
        getID: () => {
            return state.id;
        },
        setID: (val) => {
            state.id = val;
        },
        getImgPath: () => {
            return state.imgPath;
        },
        setImgPath: (path) => {
            state.imgPath = path;
        },
        getImage: () => {
            return state.image;
        },
        setImage: (val) => {
            state.image = val;
            return state.image;
        },
        getType: () => {
            return state.type;
        },
        setType: (val) => {
            state.type = val;
        },
        getXpos: () => {
            return state.Xpos;
        },
        setXpos: (val) => {
            state.Xpos = val;
        },
        getYpos: () => {
            return state.Ypos;
        },
        setYpos: (val) => {
            state.Ypos = val;
        },
        getWidth: () => {
            return state.image.width;
        },
        setWidth: (val) => {
            state.image.width = val;
        },
        // getWidthMin: () => {
        //     return state.widthMin;
        // },
        // getWidthMax: () => {
        //     return state.image.width+100;
        // },
        getHeight: () => {
            return state.image.height;
        },
        setHeight: (val) => {
            state.image.height = val;
        },
        getCenterPos: () => {
            return state.centerPos = [state.Xpos+(state.image.width/2), state.Ypos+(state.image.height/2)];
        },
        getHideComponent: () => {
            return state.hideComponent;
        },
        setHideComponent: (val) => {
            state.hideComponent = val;
        },
        getHideConnections: () => {
            return state.hideConnections;
        },
        setHideConnections: (val) => {
            state.hideConnections = val;
        },
        getIsClicked: () => {
            return state.isClicked;
        },
        setIsClicked: (val) => {
            state.isClicked = val;
        },
        hasConnection: () => {
            return state.hasCon;
        },
        setHasConnection: (val) => {
            state.hasCon = val;
        },
        getComponentName: () => {
            return state.componentName;
        },
        setComponentName: (val) => {
            state.componentName = val;
        },
        getTextSize: () => {
            return state.textSize;
        },
        setTextSize: (val) => {
            state.textSize = val;
        },
        getValidLinkingComponent: (index) => {
            return state.validLinkingComponents[index];
        },
        setValidLinkningComponents: (comps) => {
            state.validLinkingComponents = comps;
        },
        addValidLinkningComponent: (comp) =>  {
            state.validLinkingComponents.push(comp);
        },
        getGuiParams: () => {
            state.guiParams = {
                'Name': state.componentName,
                'Width': state.image.width,
                'WidthMin': 65,
                'WidthMax': 200,
                'TextSize': state.textSize,
                'TextSizeMax': 32,
                'HideComponent': state.hideComponent,
                'HideConnections': state.hideConnections,
                'Lock': false,
                'Connections': allCons.getConnectionsRelatedToComp(allComps.getSelectedComponent()),
            };
            return state.guiParams;
        },
        checkValidLinkingComponent: (comp) => {
            var isValid = false;
            state.validLinkingComponents.forEach((c)=> {
                if (comp.getType() == c) {
                    isValid = true;
                }
            });
            return isValid;
        },
        addInterface: (interface) => {
            state.interfaces.push(interface);
        },
        getInterfaces: () => {
            return state.interfaces;
        },
        getInterface: (index) => {
            return state.interfaces[index];
        },
        hasAvailablePort: () => {
            var hasAvailablePort = false;
            state.interfaces.forEach((i) => {
                print(i);
                if (i.availablePorts > 0) {
                    hasAvailablePort = true;
                }
            });
            return hasAvailablePort;
        },
        getInterfaceFromString: (string) => {
            var interface = null;
            var index = 0;
            state.interfaces.forEach(i => {
                i.ports.forEach(p => {
                    if (p == string) {
                        interface = i;
                        index = i.ports.indexOf(p);
                    }
                });
            });
            return [interface,index];
        },
    });

    Object.assign(
        state,
        getterSetter(state),
    );

    return Object.assign(
        componentInitiator(state),
        clicker(state),
        componentDisplayer(state),
        mover(state),
        prepareForJson(state),
        getterSetter(state),
    );
    
}