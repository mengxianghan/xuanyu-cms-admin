<template functional>
    <a-sub-menu :key="props.menuInfo.name">
        <span slot="title">
            <a-icon :type="props.menuInfo.meta.icon" v-if="props.menuInfo.meta.icon"/><span>{{ props.menuInfo.meta.title }}</span>
        </span>
        <template v-for="item in props.menuInfo.children">
            <x-sub-menu v-if="item.children" :menu-info="item" :key="item.meta.id"/>
            <x-menu-item v-else :menu-info="item" :key="item.meta.id"></x-menu-item>
        </template>
    </a-sub-menu>
</template>

<script>
    export default {
        name: "XSubMenu",
        props: {
            menuInfo: {
                type: Object,
                default: () => ({})
            }
        },
    };
</script>

<style scoped>

</style>