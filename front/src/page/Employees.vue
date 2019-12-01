<template>
    <!-- eslint-disable -->
    <v-row
            justify="center"
    >
        <div class="table">
            <div>
                <v-col cols="12">
                    <div class="field">
                        <v-text-field
                                v-for="item in headers"
                                v-if="item.value !== 'action' && item.value !== 'id' && item.value !== 'dateOfBirth'"
                                :key="item.text"
                                :label="item.text"
                                @input="setData($event, item.value)"
                                v-model="searchData[item.value]"
                        ></v-text-field>
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
                                        readonly
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
                                        @click="$refs.dialog.save(date), searchData['dateOfBirth'] = date"
                                >
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                        <v-btn color="primary"
                               dark class="mb-2"
                               @click="search()"
                        >
                            Search
                        </v-btn>
                    </div>


                </v-col>

            </div>
            <v-data-table
                    :headers="headers"
                    hide-default-footer
                    :items="LIST"
                    class="elevation-1 table"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-toolbar-title>My Employees</v-toolbar-title>
                        <v-divider
                                class="mx-4"
                                inset
                                vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn color="primary"
                               v-if="IS_AUTHORIZE"
                               dark class="mb-2"
                               @click="$router.push({name:'employee_create'})"
                        >
                            New employee
                        </v-btn>

                    </v-toolbar>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-btn
                            small
                            color="primary"
                            class="mr-2"
                            @click="editItem(item)"
                    >
                        edit
                    </v-btn>
                    <v-btn
                            color="error"
                            small
                            @click="dialog = true,data = item"
                    >
                        delete
                    </v-btn>
                </template>
            </v-data-table>
            <v-pagination v-model="page" :length="PAGINATE && PAGINATE.lastPage"></v-pagination>
        </div>

        <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Are you sure you want to delete the item?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialog = false, data = {}">close</v-btn>
                    <v-btn color="green darken-1" text @click="deleteItem(data)">delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    import {mapGetters} from "vuex";
    import {errorHttpFactory} from "../helpers/helpers";
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
                const one = this.LIST && this.LIST[0];
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
                    page: this.PAGINATE.page,
                    take: this.default_step,
                    find: JSON.stringify(this.searchData)
                });
            }
        }
    }
</script>

<style scoped>
    .table {
        width: 100%;
        height: 100%;
    }

    .field {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
