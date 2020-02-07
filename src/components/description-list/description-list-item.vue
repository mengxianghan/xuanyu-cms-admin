<template>
    <a-col v-bind="span">
        <div class="label">{{label}}</div>
        <div class="content">
            <slot></slot>
        </div>
    </a-col>
</template>

<script>
    const responsive = {
        1: {xs: 24},
        2: {xs: 24, sm: 12},
        3: {xs: 24, sm: 12, md: 8},
        4: {xs: 24, sm: 12, md: 6}
    }
    export default {
        name: "XDescriptionListItem",
        props: {
            label: {
                type: String,
                default: '',
                required: false
            }
        },
        inject: {
            col: {
                type: Number
            }
        },
        computed: {
            span() {
                return responsive[this.col]
            }
        }
    }
</script>

<style scoped>

</style>
