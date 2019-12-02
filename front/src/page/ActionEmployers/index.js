/* eslint-disable */
import {errorHttpFactory} from "../../helpers/helpers";
import {mapGetters} from "vuex";

export default {
    name: "ActionEmployers",
    data:() => ({
        progressData: false,
        progress: false,
        modalPicker: false,
        dialog:true,
        valid: null,
        date: new Date().toISOString().substr(0, 10),
        data: {},
        required:[v => !!v || 'This field is required'],
        max:[v => (v && v.length <= 10) || 'Max 10 characters'],
        min:[v => (v && v.length >= 6) || 'Minimum 6 characters']
    }),
    computed:{
        ...mapGetters({
            PAGINATE: 'EmployeesModule/GET_PAGINATE'
        }),
        salary(){
            return this.required.concat(this.max)
        },

        positionAndFio(){
            return this.min.concat(this.required)
        },

        isCreateEdit(){
            return this.isNameAction === 'employee_create' ||  this.isNameAction === 'employee_edit'
        },

        isNameAction(){
            const name = this.$route.name;
            return name ? name : '';
        },

    },
    created(){
        if(this.isNameAction === 'employee_edit') {
            this.get_employee(this.$route.params.id)
        }
    },
    methods:{

        action(name){
            this.data.dateOfBirth = this.date;

            const data = {
                ...this.data
            };

            data.salary = parseInt(data.salary);

            switch (name) {
                case 'employee_create':
                    return this.employee_create(data);
                case  'employee_edit':
                    return this.employee_edit(data);
            }
        },

        async employee_create(data){

            if (!this.isValid) {
                this.setMessage( 'error', "Please set valid data", true);
                return false;
            }

            this.progress = true;

            try {
                await this.$store.dispatch('EmployeesModule/CREATE_EMPLOYEE_BY_ID', data);
                this.$store.dispatch('EmployeesModule/GET_EMPLOYEES_WITH_SERVER',{
                    ...this.PAGINATE
                });
                this.setMessage('info', 'Item successfully created', true);
                this.$router.push({name: 'employees'})
            } catch (e) {
                errorHttpFactory(e, this.setMessage);
                this.progress = false;
            }
        },

        async get_employee(id){
            this.progress = true;
            try {
                const {body} = await this.$store.dispatch('EmployeesModule/GET_EMPLOYEE_BY_ID', id);
                this.data = body;
                this.progress = false;
            } catch (e) {
                errorHttpFactory(e, this.setMessage);
                this.progress = false;
            }
        },

        async employee_edit(data){

            if (!this.isValid) {
                this.setMessage('error', "Please set valid data", true);
                return false;
            }

            this.progress = true;

            try {
                await this.$store.dispatch('EmployeesModule/UPDATE_EMPLOYEE_BY_ID', data);
                this.$store.dispatch('EmployeesModule/GET_EMPLOYEES_WITH_SERVER',{
                    ...this.PAGINATE
                });
                this.setMessage('info', 'Item successfully edited', true);
                this.$router.push({name: 'employees'})
            } catch (e) {
                errorHttpFactory(e, this.setMessage);
                this.progress = false;
            }

        },

        setData(data, name){
            !data && (data = '');
            switch (name) {
                case 'position':
                    const str = data.replace(/[^a-z]/g, '');
                    this.data[name] = new String(str);
                    return;
                case 'salary':
                    const num = parseInt(data.replace(/\D+/g,""));
                    this.data[name] = new String(!isNaN(num) ? num : '');
                    return
            }
        },

        isValid(){
            return this.$refs.form.validate()
        },

        setMessage(type, text, active){
            this.$store.commit('AuthModule/SET_TOAST', {
                type: type,
                text: text,
                active: active
            });
        },
    }

}
