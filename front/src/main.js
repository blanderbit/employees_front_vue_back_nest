import Vue from 'vue'
import App from './App.vue'

import Vuex from 'vuex';
import VueResource from'vue-resource';

import store from "./store/store";
import vuetify from './plugins/vuetify';
import {
    router
} from "./plugins/router";


Vue.use(VueResource);
Vue.use(Vuex);

Vue.config.productionTip = false;
Vue.http.options.root = environment;

window.http = Vue.http;

import {request, response} from './api/interseptors.js';
import { environment } from './enviroment';

Vue.http.interceptors.push(request);
Vue.http.interceptors.push(response);

new Vue({
    render: h => h(App),
    router,
    vuetify,
    store
}).$mount('#app');
