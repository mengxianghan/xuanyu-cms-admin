<template functional>
    <a-menu-item :key="props.menuInfo.name">
        <a :href="props.menuInfo.path"
           target="_blank"
           v-if="props.menuInfo.meta.isExternal === true">
            <a-icon :type="props.menuInfo.meta.icon" v-if="props.menuInfo.meta.icon"/>
            <span>{{props.menuInfo.meta.title}}</span>
        </a>
        <router-link :to="{name:props.menuInfo.name}"
                     v-else>
            <a-icon :type="props.menuInfo.meta.icon" v-if="props.menuInfo.meta.icon"/>
            <span>{{props.menuInfo.meta.title}}</span>
        </router-link>
    </a-menu-item>
</template>

<script>
    export default {
        name: "XMenuItem",
        props: {
            menuInfo: {
                type: Object,
                default: () => ({})
            }
        }
    }
</script>

<style scoped>

</style>
