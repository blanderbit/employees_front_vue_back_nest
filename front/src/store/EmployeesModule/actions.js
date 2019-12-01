import {Employees} from "../../api/employees";

export const actions = {

    GET_EMPLOYEES_WITH_SERVER({commit}, payload = {}) {
        return Employees.getAll(payload)
            .then(({body}) => {
                commit('SET_LIST',body.data);
                body.data && delete body.data;
                body = {
                    ...payload,
                    ...body
                };
                commit('SET_PAGINATE', new Object(body));
                return true;
            })
    },

    GET_EMPLOYEE_BY_ID (context, id) {
        return Employees.getById(id)
            // .then()
    },

    DELETE_EMPLOYEE_BY_ID (context, id) {
        return Employees.deleteById(id)
    },

    UPDATE_EMPLOYEE_BY_ID (context, data) {
        const id = data.id;
        data.id && delete data.id;
        return Employees.updateById(data, id)
    },

    CREATE_EMPLOYEE_BY_ID (context, data) {
        return Employees.create(data)
    }

};

