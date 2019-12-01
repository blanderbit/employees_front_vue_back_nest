<template>
    <!-- eslint-disable -->
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="indigo">
                    <span class="headline capitalize">{{name}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form
                                ref="form"
                                v-model="valid"
                        >
                            <v-row>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                            v-if="isRegisterPage"
                                            label="Name*"
                                            v-model="data.name"
                                            :rules="rule"
                                            :min="4"
                                            required
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                            label="Email*"
                                            v-model="data.email"
                                            :rules="emailRules"
                                            required
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                            label="Password*"
                                            v-model="data.password"
                                            type="password"
                                            :rules="rule"
                                            :min="4"
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
                                color="blue darken-1 capitalize"
                                text
                                @click="isRegisterPage ? register() : login()"
                                :disabled="!valid"
                        >
                            {{name}}
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
    import {Token as TOKEN} from "../store/localStorage/Token";
    import {Auth} from "../api/auth";
    import {errorHttpFactory} from "../helpers/helpers";

    const required = [v => !!v || 'This field is required'];
    export default {
        name: "auth",
        data: () => ({
            dialog: true,
            valid: null,
            data: {},
            progress: false,
            required:required,
            emailRules: required.concat([
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ]),
            rule:required.concat([
                v => (v && v.length > 4) || 'Minimum 4 characters'
            ]),
        }),
        computed:{

            isRegisterPage(){
                return this.name === 'register'
            },

            name(){
                return this.$route.name
            }

        },
        methods: {

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

            async register(){
                if (!this.isValid) {
                    this.setMessage( 'error', "Please set valid data", true);
                    return
                }

                this.progress = true;
                try {
                    const register = await Auth.register(this.data);
                    register.status === 201 && this.$router.push({name: 'login'})
                } catch (e) {
                    errorHttpFactory(e, this.setMessage);
                    this.progress = false;
                }
            },

            async login(){
                if (!this.isValid) {
                    this.setMessage( 'error', "Please set valid data", true);
                    return
                }
                this.progress = true;
                try {
                    const login = await Auth.login(this.data);

                    TOKEN.setToken(login.body.accessToken);
                    const {body} = await Auth.getUser();
                    this.$store.commit('AuthModule/SET_DATA', {
                        name: 'user',
                        value: body
                    });
                    this.$store.commit('AuthModule/SET_DATA', {
                        name:'isAuthorize',
                        value: true
                    });
                    this.$router.push({name: 'employees'});

                } catch (e) {
                    errorHttpFactory(e, this.setMessage);
                    this.progress = false;
                }
            }
        }
    }
</script>

<style scoped>
    .headline{
        color: white;
    }
    .progress{
        width: 100px;
        display: flex;
        justify-content: center;
    }
    .capitalize{
        text-transform: capitalize;
    }
</style>
