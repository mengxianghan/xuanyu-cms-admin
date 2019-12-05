<template>
    <div class="user-layout">
        <div class="user-layout-top">
            <div class="user-layout-top-header">
                <img src="~@/assets/images/logo.svg"/>
                <span>{{name}}</span>
            </div>
            <div class="user-layout-top-desc">
                一款前后端分离的快速开发框架
            </div>
        </div>
        <div class="user-layout-main">
            <a-form size="large"
                    :form="form">
                <a-form-item>
                    <a-input size="large"
                             placeholder="账户：admin"
                             v-decorator="['username',{rules:[{required:true,message:'请输入用户名'}]}]">
                        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-input-password size="large"
                                      placeholder="密码：123456"
                                      v-decorator="['password',{rules:[{required:true,message:'请输入密码'}]}]">
                        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
                    </a-input-password>
                </a-form-item>
                <a-form-item>
                    <a-button size="large" type="primary" block html-type="submit" @click="handleLogin"
                              :loading="loading"
                              class="login-form-button">
                        登录
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
        <!--<div class="user-layout-footer">
            <div class="links">
                <a href="##">帮助</a>
                <a href="##">隐私</a>
                <a href="##">条款</a>
            </div>
            <div class="copyright">Copyright © 2018 白鹭学园技术组出品</div>
        </div>-->
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    export default {
        name: "login",
        data() {
            return {
                form: this.$form.createForm(this),
                loading: false
            };
        },
        created() {
        },
        computed: {
            ...mapState({
                name: state => state.app.name
            })
        },
        methods: {
            ...mapActions({
                login: 'user/login'
            }),
            /**
             * 登录
             */
            handleLogin() {
                this.form.validateFieldsAndScroll((errors, values) => {
                    if (!errors) {
                        this.loading = true;
                        this.login({
                            username: values.username,
                            password: values.password
                        }).then(() => {
                            this.loading = false;
                        }, err => {
                            this.loading = false;
                        });
                    }
                });
            }
        },
    };
</script>

<style lang="scss" scoped>
    .user-layout {
        min-height: 100vh;
        background: rgb(240, 242, 245) url("~@/assets/images/login-bg.svg") no-repeat center;
        background-size: cover;
        display: flex;
        flex-direction: column;

        &-top {
            padding-top: 110px;

            &-header {
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    height: 56px;
                    margin-right: 16px;
                }

                span {
                    font-size: 33px;
                    font-weight: 600;
                    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
                    color: rgba(0, 0, 0, .85);
                    position: relative;
                    top: 1px;
                }
            }

            &-desc {
                text-align: center;
                margin: 12px 0 40px;
                color: rgba(0, 0, 0, .45);
            }
        }

        &-main {
            width: 388px;
            margin: 0 auto;
            flex: 1;
        }

        &-footer {
            padding: 0 16px;
            margin: 48px 0 24px;
            text-align: center;

            .links {
                margin-bottom: 8px;

                a {
                    color: rgba(0, 0, 0, .45);
                    padding: 0 4px;
                }
            }

            .copyright {
                color: rgba(0, 0, 0, .45);
            }
        }
    }
</style>