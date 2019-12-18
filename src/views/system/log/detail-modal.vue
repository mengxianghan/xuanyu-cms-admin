<template>
    <a-modal v-model="visible"
             :title="title"
             @ok="onOk"
             @cancel="onCancel">

    </a-modal>
</template>

<script>
    import {form} from '@/utils/mixin';

    export default {
        mixins: [form],
        data() {
            return {};
        },
        methods: {
            handleDetail() {
                this.title = '详情';
                this.visible = true;
            },
            onOk() {
            },
            onCancel() {
            }
        }
    };
</script>

<style scoped>

</style>