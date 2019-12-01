import { getters } from "./getters";
import { mutations } from "./mutations";
import { state } from "./state";

export const AuthModule = {
    getters,
    mutations,
    state,
    namespaced: true,
};
