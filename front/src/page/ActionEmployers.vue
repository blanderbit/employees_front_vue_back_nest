
<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="indigo">
                    <span class="headline">{{isNameAction.replace('_', ' ')}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <div v-if="progressData" class="progress all">
                            <v-progress-circular
                                    indeterminate
                                    color="primary"
                            ></v-progress-circular>
                        </div>
                        <v-form
                                v-if="!progressData"
                                ref="form"
                                v-model="valid"
                        >
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field
                                            label="FIO*"
                                            v-model="data.fio"
                                            :rules="positionAndFio"
                                            :min="6"
                                            required
                                            :disabled="!isCreateEdit"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-dialog
                                            ref="dialog"
                                            v-model="modalPicker"
                                            :return-value.sync="date"
                                            width="290px"
                                            persistent
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                    v-model="date"
                                                    label="Date of birth"
                                                    :disabled="!isCreateEdit"
                                                    readonly
                                                    :rules="required"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="date" scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                    text
                                                    color="primary"
                                                    @click="modalPicker = false"
                                            >
                                                Cancel
                                            </v-btn>
                                            <v-btn
                                                    text
                                                    color="primary"
                                                    @click="$refs.dialog.save(date)"
                                            >
                                                OK
                                            </v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                            label="Position*"
                                            v-model="data.position"
                                            :rules="positionAndFio"
                                            :min="6"
                                            @input='setData($event, "position")'
                                            required
                                            :disabled="!isCreateEdit"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                            label="Salary*"
                                            v-model="data.salary"
                                            :rules="salary"
                                            @input='setData($event, "salary")'
                                            :disabled="!isCreateEdit"
                                            required
                                    >
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <div v-if="!progress">
                        <v-btn
                                color="blue darken-1"
                                text
                                @click="$router.push({name: 'employees'})"
                        >
                            Close
                        </v-btn>
                        <v-btn
                                color="blue darken-1"
                                text
                                v-if="isCreateEdit"
                                @click="isCreateEdit && action(isNameAction)"
                                :disabled="!valid"
                        >
                            Save
                        </v-btn>
                        <v-btn
                                color="blue darken-1"
                                text
                                v-if="!isCreateEdit"
                                @click="$router.push({name: 'employee_edit'})"
                                :disabled="!valid"
                        >
                            edit
                        </v-btn>
                    </div>
                    <div v-if="progress" class="progress">
                        <v-progress-circular
                                indeterminate
                                color="primary"
                        ></v-progress-circular>
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    /* eslint-disable */
    import {errorHttpFactory} from "../helpers/helpers";
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
</script>

<style scoped>
    .progress{
        width: 100px;
        display: flex;
        justify-content: center;
    }
    .headline{
        color: white;
        text-transform: capitalize;
    }
    .all{
        width: 100%;
        height: 100%;
    }
</style>
