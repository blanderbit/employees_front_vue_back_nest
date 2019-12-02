import Auth from "../page/Auth/index.vue";
import Employees from "../page/Employees/index.vue";
import ActionEmployers from "../page/ActionEmployers/index.vue";

export const routes = [
    { path: '/', redirect: '/employees' },
    { path: '*', redirect: '/employees' },
    {
        path: '/login',
        name: 'login',
        components: {
            default: Employees,
            login: Auth,
        }
    },
    {
        path: '/register',
        name: 'register',
        components: {
            default: Employees,
            register: Auth,
        }
    },
    {
        path: '/employees',
        component: Employees,
        name: 'employees',
    },
    {
        path: '/employee/check/:id',
        name: 'employee_check',
        components: {
            default: Employees,
            employee_check: ActionEmployers,
        }
    },
    {
        path: '/employee/edit/:id',
        name: 'employee_edit',
        components: {
            default: Employees,
            employee_edit: ActionEmployers,
        }
    },
    {
        path: '/employee/create',
        name: 'employee_create',
        components: {
            default: Employees,
            employee_create: ActionEmployers,
        }
    }
];
