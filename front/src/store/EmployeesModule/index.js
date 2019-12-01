import { getters } from "./getters";
import { mutations } from "./mutations";
import { actions } from "./actions";
import { state } from "./state";

export const EmployeesModule = {
    actions,
    getters,
    mutations,
    state,
    namespaced: true,
};
