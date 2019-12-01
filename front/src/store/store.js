import Vue from 'vue';
import Vuex from 'vuex';
import {AuthModule} from "./AuthModule";
import {EmployeesModule} from "./EmployeesModule";

Vue.use(Vuex);

export default new Vuex.Store({
    modules:{
        AuthModule: AuthModule,
        EmployeesModule: EmployeesModule
    },
    strict: process.env.NODE_ENV !== 'production'
})
