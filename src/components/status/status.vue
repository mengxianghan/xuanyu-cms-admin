<template>
    <a-badge :status="status" :text="text" v-if="status"></a-badge>
</template>

<script>
    const list = [
        {
            status: 'error',
            text: '禁用'
        },
        {
            status: "success",
            text: '正常'
        }
    ];
    export default {
        name: "XStatus",
        props: {
            code: {
                type: [String, Number],
                default: ''
            }
        },
        data() {
            return {};
        },
        computed: {
            status() {
                return list[Number(this.code)].status;
            },
            text() {
                return list[Number(this.code)].text;
            },
        }
    };
</script>

<style scoped>

</style>