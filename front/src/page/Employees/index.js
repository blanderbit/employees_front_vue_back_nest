import {mapGetters} from "vuex";
import {errorHttpFactory} from "../../helpers/helpers";
import {defaultHeaders} from "../../const/const";
/* eslint-disable */
export default {
    name: "BoredData",
    data() {
        return {
            default_page: 1,
            default_step: 10,
            dialog: false,
            data: {},
            modalPicker: false,
            date: new Date().toISOString().substr(0, 10),
            searchData: {}
        }
    },
    created() {
        this.$store.dispatch('EmployeesModule/GET_EMPLOYEES_WITH_SERVER', {
            page: this.default_page,
            take: this.default_step,
            find: JSON.stringify(this.searchData)
        });
    },
    computed: {

        ...mapGetters({
            LIST: 'EmployeesModule/GET_LIST',
            PAGINATE: 'EmployeesModule/GET_PAGINATE',
            IS_AUTHORIZE: 'AuthModule/IS_AUTHORIZE',
        }),

        page: {
            get() {
                return (this.PAGINATE && Number(this.PAGINATE.currentPage)) || this.default_page;
            },
            set(value) {
                this.$store.dispatch('EmployeesModule/GET_EMPLOYEES_WITH_SERVER', {
                    page: value || this.default_page,
                    take: this.default_step,
                    find: JSON.stringify(this.searchData)
                });
            }
        },

        headers() {
            const one = (this.LIST && this.LIST[0]) || defaultHeaders;
            const arr = one ? Object.keys(one)
                .map(item => ({
                    text: item.toUpperCase(),
                    value: item,
                    sortable: false
                })) : [];
            if (arr.length > 0 && this.IS_AUTHORIZE) {
                arr.push({
                    text: 'Actions',
                    value: 'action',
                    sortable: false
                })
            }
            return arr;
        },
    },
    methods: {

        setMessage(type, text, active){
            this.$store.commit('AuthModule/SET_TOAST', {
                type: type,
                text: text,
                active: active
            });
        },

        editItem({id}) {
            this.$router.push(`/employee/edit/${id}`)
        },

        async deleteItem({id}) {
            try {

                await this.$store.dispatch('EmployeesModule/DELETE_EMPLOYEE_BY_ID', id);

                const array = Array.isArray(this.LIST) && JSON.parse(JSON.stringify(this.LIST));

                const paginate = {
                    ...this.PAGINATE
                };

                if (array) {
                    let findIndex;
                    array.find((item, index) => item.id === id && (findIndex = index));
                    typeof findIndex === 'number' && array.splice(findIndex, 1);
                    array.length === 0 && (paginate.page -= 1)
                }

                this.$store.dispatch('EmployeesModule/GET_EMPLOYEES_WITH_SERVER',
                    paginate
                );

                this.setMessage('info', 'Item successfully deleted', true);
                this.dialog = false;
            } catch (e) {
                errorHttpFactory(e, this.setMessage);
                this.dialog = false;
            }
        },

        setData(data, name){
            !data && (data = '');
            switch (name) {
                case 'position':
                    const str = data.replace(/[^a-z]/g, '');
                    this.searchData[name] = new String(str);
                    return;
                case 'salary':
                    const num = parseInt(data.replace(/\D+/g,""));
                    this.searchData[name] = new String(!isNaN(num) ? num : '');
                    return
            }
        },

        search() {
            this.$store.dispatch('EmployeesModule/GET_EMPLOYEES_WITH_SERVER', {
                page: this.default_page,
                take: this.default_step,
                find: JSON.stringify(this.searchData)
            });
        }
    }
}
