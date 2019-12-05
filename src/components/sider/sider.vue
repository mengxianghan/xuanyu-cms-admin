<template>
    <a-layout-sider width="235px" :trigger="null" collapsible v-model="collapsed">
        <div class="layout-brand">
            <img :src="logo" height="40"/>
            <h1>{{name}}</h1>
        </div>
        <x-menu></x-menu>
    </a-layout-sider>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'XSider',
        props: {
            collapsed: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {};
        },
        computed: {
            ...mapState({
                name:state=>state.app.name,
                logo: state => state.app.logo
            })
        }
    };
</script>

<style lang="scss" scoped>
    .layout {

        &-brand {
            height: 64px;
            background: #002140;
            overflow: hidden;
            padding-left: 20px;
            line-height: 64px;

            img {
                display: inline-block;
                vertical-align: middle;
                height: 40px;
            }

            h1 {
                font-size: 20px;
                color: #fff;
                margin: 0 0 0 8px;
                font-weight: 600;
                display: inline-block;
                vertical-align: middle;
            }
        }
    }
</style>