<template>
    <!-- eslint-disable -->
    <v-app id="inspire">
        <v-navigation-drawer
                v-model="drawer"
                app
        >
            <div class="container_user" v-if="IS_AUTHORIZE">
                <div class="logo">
                    {{USER}}
                </div>
            </div>
            <v-list dense>
                <v-list-item
                        v-for="item in sitebarList"
                        :key="item.name"
                        v-if="isToken(item)"
                        @click="!item.function ? !activeLink(item.url) && $router.push(item.url) : item.function(store)"
                        :style="{
                            background: !item.function && activeLink(item.url) ? 'blue' : 'white'
                        }"
                >
                    <v-list-item-content>
                        <v-list-item-title
                                :style="{
                                    color: !item.function && activeLink(item.url) ? 'white' : ''
                                }"
                        >
                            {{item.name}}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
                app
                color="indigo"
                dark
        >
            <v-app-bar-nav-icon
                    @click.stop="drawer = !drawer"
            >
            </v-app-bar-nav-icon>
            <v-toolbar-title>Application</v-toolbar-title>
        </v-app-bar>

        <v-content>
            <v-container
                    class="fill-height"
                    fluid
            >
                <router-view></router-view>

                <router-view
                        v-for="name in names"
                        :key="name"
                        :name="name">
                </router-view>
            </v-container>
        </v-content>
        <v-footer
                color="indigo"
                app
        >
            <span class="white--text">&copy; 2019</span>
        </v-footer>
        <div class="spinner" v-if="active">
            <v-progress-circular
                    :width="3"
                    color="primary"
                    indeterminate
            ></v-progress-circular>
        </div>
        <message-toast></message-toast>
    </v-app>
</template>

<script>
    import MessageToast from "./components/toast";
    import {Token} from "./store/localStorage/Token";
    import {errorHttpFactory, reformatLetterFactory} from "./helpers/helpers";
    import {Auth} from "./api/auth";
    import {names, siteBarList} from "./const/const";

    export default {
        name: 'App',
        components: {
            MessageToast
        },
        data: () => ({
            drawer: null,
            name: '',
            store: {},
            active: false,
            names: names,
            sitebarList: siteBarList
        }),
        created() {
            const pathActive = this.$route.path;

            this.store = this.$store;
            const token = Token.getToken();


            token && this.$store.commit('AuthModule/SET_DATA', {
                name: 'isAuthorize',
                value: true
            });

            this.findActiveOrBlock(pathActive);

            this.getUser();

            this.$router.beforeEach(({path}, from, next) => this.findActiveOrBlock(path, next));

            this.name = this.$route.path;
        },
        computed: {
            IS_AUTHORIZE() {
                return this.$store.getters['AuthModule/IS_AUTHORIZE']
            },
            USER() {
                const user = this.$store.getters['AuthModule/GET_USER'];
                const nameArr = user && user.name ? user.name.split(' ') : [];
                return reformatLetterFactory(nameArr);
            }
        },
        methods: {
            activeLink(name) {
                return this.name.indexOf(name) > -1
            },
            findActiveOrBlock(path, next) {
                const activeUrl = Array.isArray(this.sitebarList) && this.sitebarList.find(({url}) => url === path);

                const isNext = typeof next === 'function';

                if (activeUrl && this.isToken(activeUrl)) {
                    isNext && next();
                } else {
                    isNext ? next() : this.$router.push('/employees')
                }
            },
            isToken(item) {
                const ok = true;
                return item && item.checkToken
                    ? !item.TokenActive && !this.IS_AUTHORIZE
                        ? ok
                        : item.TokenActive && this.IS_AUTHORIZE
                    : ok
            },
            setMessage(type, text, active) {
                this.$store.commit('AuthModule/SET_TOAST', {
                    type: type,
                    text: text,
                    active: active
                });
            },
            async getUser() {
                if (!this.IS_AUTHORIZE) {
                    return;
                }
                try {
                    const {body} = await Auth.getUser();
                    this.$store.commit('AuthModule/SET_DATA', {
                        name: 'user',
                        value: body
                    });
                } catch (e) {
                    errorHttpFactory(e, this.setMessage);
                }
            },
        },
        watch: {
            '$route'(to) {
                this.name = to.path;
            }
        }
    };
</script>

<style>
    .container_user {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
    }

    .logo {
        width: 70px;
        height: 70px;
        background: maroon;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }
</style>
