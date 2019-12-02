import {Token as TOKEN} from "../../store/localStorage/Token";
import {Auth} from "../../api/auth";
import {errorHttpFactory} from "../../helpers/helpers";

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
                if(register.status === 201){
                    this.setMessage('info', 'User successfully register', true);
                    this.$router.push({name: 'login'})
                }
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
                this.setMessage('info', 'User successfully authorization', true);
                this.$router.push({name: 'employees'});
            } catch (e) {
                errorHttpFactory(e, this.setMessage);
                this.progress = false;
            }
        }
    }
}
