<template>
    <div>
        <a-layout :style="{height:'100vh'}">
            <x-sider :collapsed="collapsed"></x-sider>
            <a-layout>
                <a-layout-header :style="{background:'#fff',position:'sticky',top:0,zIndex:10,padding:0}">
                    <div class="layout-header__action"
                         @click="()=> collapsed = !collapsed">
                        <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'"/>
                    </div>
                    <div class="layout-header__right">
                        <!--<div class="layout-header__action">
                            <a-icon type="search"/>
                        </div>
                        <a-tooltip placement="bottom" title="使用文档">
                            <div class="layout-header__action">
                                <a-icon type="question-circle"/>
                            </div>
                        </a-tooltip>
                        <div class="layout-header__action">
                            <a-badge count="11">
                                <a-icon type="bell"/>
                            </a-badge>
                        </div>-->
                        <a-tooltip placement="bottom" title="Github">
                            <div class="layout-header__action">
                                <a href="https://github.com/mengxianghan/xuanyu-cms-front"
                                   target="_blank">
                                    <a-icon type="github"/>
                                </a>
                            </div>
                        </a-tooltip>
                        <a-dropdown>
                            <div class="layout-header__action">
                                <div class="layout-header__user-info">
                                    <a-avatar :src="logo"></a-avatar>
                                    {{fullName}}
                                </div>
                            </div>
                            <a-menu slot="overlay">
                                <a-menu-item key="logout" @click="handleLogout">
                                    <a-icon type="logout"/>
                                    退出登录
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                        <!--<a-dropdown>
                            <div class="layout-header__action">
                                <a-icon type="global"/>
                            </div>
                            <a-menu slot="overlay">
                                <a-menu-item>CN 简体中文</a-menu-item>
                                <a-menu-item>GB English</a-menu-item>
                            </a-menu>
                        </a-dropdown>-->
                    </div>
                </a-layout-header>
                <a-layout-content>
                    <div class="layout-content">
                        <router-view/>
                    </div>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        data() {
            return {
                collapsed: false
            };
        },
        computed: {
            ...mapState({
                logo: state => state.app.logo,
                fullName: state => state.user.fullName
            })
        },
        methods: {
            /**
             * 退出登录
             * @param e
             */
            handleLogout(e) {
                this.$confirm({
                    title: '注销登录？',
                    onOk: () => {
                        this.$ls.clear();
                        const {href} = this.$router.resolve({name: 'login'});
                        location.href = href;
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .layout {
        &-header {
            &__right {
                float: right
            }

            &__action {
                padding: 0 16px;
                float: left;
                cursor: pointer;

                &:hover {
                    background: rgba(0, 0, 0, .025);
                }

                .anticon {
                    padding: 4px;
                }

                a {
                    color: rgba(0, 0, 0, .65);
                }
            }

            &__user-info {
                display: flex;
                align-items: center;

                .ant-avatar {
                    margin-right: 8px;
                }
            }
        }

        &-content {
            padding: 24px;
        }
    }

    /deep/ {
        .ant-layout-header {
            box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
        }

        .ant-layout-sider {
            box-shadow: 2px 0 8px 0 rgba(29, 35, 41, .05);
            position: relative;
            z-index: 10;
        }

        .menu.ant-menu {
            height: calc(100vh - 64px);
            overflow: hidden;

            &:hover {
                overflow-y: auto;
            }
        }
    }
</style>