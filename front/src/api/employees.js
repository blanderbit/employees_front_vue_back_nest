import Vue from 'vue';

const base = 'employees';

export class Employees{
    static create(data){
        return Vue.http.post(`${base}`, data)
    }
    static getAll ({page = '', take = '', find = ''}){
        return Vue.http.get(`${base}?page=${page}&take=${take}&find=${btoa(find)}`)
    }
    static getById (id){
        return Vue.http.get(`${base}/${id}`)
    }
    static deleteById (id){
        return Vue.http.delete(`${base}/${id}`)
    }
    static updateById (data, id){
        return Vue.http.put(`${base}/${id}`, data)
    }
}
