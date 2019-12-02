import {Token} from "../store/localStorage/Token";

export const names = [
    'register',
    'login',
    'employee_check',
    'employee_edit',
    'employee_create'
];

export const siteBarList = [
    {
        name: 'Employees',
        url: '/employees',
        checkToken: false
    }, {
        name: 'Login',
        url: '/login',
        checkToken: true,
        TokenActive: false
    }, {
        name: 'Register',
        url: '/register',
        checkToken: true,
        TokenActive: false
    }, {
        name: 'Create',
        url: '/employee/create',
        checkToken: true,
        TokenActive: true
    }, {
        name: 'Logout',
        function: function ($store) {
            Token.clearStorageData();
            $store && $store.commit('AuthModule/SET_DATA', {
                name: 'isAuthorize',
                value: false
            });
        },
        checkToken: true,
        TokenActive: true
    },
];

export const defaultHeaders = {
    dateOfBirth: 'test',
    fio:  'test',
    id: 0,
    position:  'test',
    salary: 0
};
