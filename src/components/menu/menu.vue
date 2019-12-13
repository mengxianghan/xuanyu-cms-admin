<template>
    <a-menu theme="dark" mode="inline"
            :openKeys="openKeys"
            v-model="selectedKeys"
            @openChange="onOpenChange"
            class="menu">
        <template v-for="item in menu">
            <x-sub-menu v-if="item.children" :menu-info="item" :key="item.meta.id"/>
            <x-menu-item v-else :menu-info="item" :key="item.meta.id"></x-menu-item>
        </template>
    </a-menu>
</template>

<script>
    import {mapState} from 'vuex';
    import {getParents} from '@/utils/util';

    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    export default {
        name: "XMenu",
        data() {
            return {
                openKeys: [],
                selectedKeys: [],
            };
        },
        created() {
            this.setSelectedMenu();
        },
        watch: {
            '$route'(val) {
                this.setSelectedMenu();
            }
        },
        computed: {
            ...mapState({
                menu: state => state.asyncRoutes.menu
            }),
            rootSubmenuKeys() {
                return this.menu.map(item => item.name);
            }
        },
        methods: {
            /**
             * 设置选中菜单
             */
            setSelectedMenu() {
                const currentRouteName = this.$route.meta.active || this.$route.name;
                const parents = getParents(this.menu, 'name', currentRouteName);
                this.selectedKeys = [currentRouteName];
                this.openKeys = parents.splice(0, parents.length - 1).map(item => item.name);
            },
            /**
             * SubMenu 展开/关闭的回调
             * @param openKeys
             */
            onOpenChange(openKeys) {
                const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
                if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                    this.openKeys = openKeys;
                } else {
                    this.openKeys = latestOpenKey ? [latestOpenKey] : [];
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>