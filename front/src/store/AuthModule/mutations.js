/* eslint-disable */

export const mutations = {
    SET_DATA(state, data){
        state[data.name] = data.value;
    },
    SET_TOAST(state, data){
        state.toast = data
    },
};
