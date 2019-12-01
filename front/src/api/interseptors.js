import {Token} from "../store/localStorage/Token";

import {
    router
} from "../plugins/router";
import store from "../store/store";

export const request = (request, next) => {
    request.url = `${request.root.url}${request.url}`;
    const token = Token.getToken();
    if(token) {
        request.headers.append('Authorization', `Bearer ${token}`)
    }
    return next();
};

export const response = (request, next) => {
    next((response) => {
        if(response.status === 401){
            Token.clearStorageData();
            store.commit('AuthModule/SET_DATA', {
                name:'isAuthorize',
                value: false
            });
            router.push({name: 'employees'})
        }
    })
};
