import Vue from 'vue';

export class Auth{
    static register(data){
        return Vue.http.post(`auth/signUp`, data)
    }
    static login (data){
        return Vue.http.post(`auth/signIn`, data)
    }
    static getUser (){
        return Vue.http.get(`auth/user`)
    }
}
