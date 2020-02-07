<template>
    <a-modal v-model="visible"
             :title="title"
             :confirm-loading="confirmLoading"
             @ok="onOk"
             @cancel="onCancel">
        <a-form :form="form"
                v-bind="formItemLayout">
            <a-form-item label="名称">
                <a-input v-decorator="['name',{rules:[{required:true,message:'请输入名称'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="状态">
                <a-radio-group v-decorator="['status',{initialValue:'1'}]"
                               :disabled="isSuper">
                    <a-radio value="1">正常</a-radio>
                    <a-radio value="0">禁用</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="排序">
                <a-input-number v-decorator="['sort',{initialValue:'99'}]"></a-input-number>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import {form} from '@/utils/mixin'

    export default {
        mixins: [form],
        data() {
            return {}
        },
        computed: {
            /**
             * 是否超级管理员
             */
            isSuper() {
                return this.record.type === '1' ? true : false
            }
        },
        methods: {
            /**
             * 新增
             */
            handleInsert() {
                this.toggleModal()
                this.title = '新增角色'
            },
            /**
             * 编辑
             */
            handleEdit(record) {
                this.toggleModal()
                this.record = record
                this.title = '编辑角色'
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        name: record.name,
                        status: record.status,
                        sort: record.sort
                    })
                })
            },
            /**
             * 删除
             * @param record
             */
            handleDelete(record) {
                this.$api.system.role.delete({
                    id: record.id
                }).then(({code}) => {
                    if (code === '200') {
                        this.$emit('delete', record)
                        this.$emit('complete', record)
                    }
                })
            },
            /**
             * 确认
             */
            onOk() {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        this.confirmLoading = true
                        this.$api.system.role.submit({
                            id: this.record.id,
                            name: values.name,
                            status: values.status,
                            sort: values.sort
                        }).then(({code}) => {
                            this.confirmLoading = false
                            if (code === '200') {
                                this.reset()
                                this.toggleModal()
                                this.$emit('ok', values)
                                this.$emit('complete', values)
                            }
                        }, err => {
                            this.confirmLoading = false
                        })
                    }
                })
            },
            /**
             * 取消
             */
            onCancel() {
                this.reset()
                this.toggleModal()
                this.$emit('cancel')
            }
        }
    }
</script>

<style scoped>

</style>
