function validationRule(type1, type2, allowed, msg) {
    let state = {
        "id": null,
        "ruleTypes": [type1, type2],
        "allowed": allowed,
        "hasConditions": null,
        "warningMsg": msg
    }

    const getterSetter = (state) => ({
        getID: () => {
            return state.id;
        },
        setID: (id) => {
            state.id = id;
        },
        getRuleType: (index) => {
            return state.ruleTypes[index];
        },
        setRuleTypes: (type1, type2) => {
            state.ruleTypes[0] = type1;
            state.ruleTypes[1] = type2;
        },
        isAllowed: () => {
            return state.allowed;
        },
        hasConditions: () => {
            return state.hasConditions;
        },
        getWarningMsg: () => {
            return state.warningMsg;
        },
        setWarningMsg: (msg) => {
            state.warningMsg = msg;
        }
    });

    Object.assign(
        state,
        getterSetter(state),
    );

    return Object.assign(
        getterSetter(state),
    );
    
}