<template>
    <a-modal v-model="visible"
             :title="title"
             :confirm-loading="confirmLoading"
             @ok="onOk"
             @cancel="onCancel">
        <a-form :form="form"
                v-bind="formItemLayout">
            <a-form-item label="上级分类">
                <a-tree-select :tree-data="treeData"
                               v-decorator="['parent_id',{rules:[{required:true,message:'请选择上级分类'}]}]"></a-tree-select>
            </a-form-item>
            <a-form-item label="名称">
                <a-input v-decorator="['name',{rules:[{required:true,message:'请输入名称'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="状态">
                <a-radio-group v-decorator="['status',{initialValue:'1'}]">
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
    import {form} from '@/utils/mixin';
    import {getFieldsValue, changeKeys} from "@/utils/util";

    export default {
        mixins: [form],
        data() {
            return {};
        },
        computed: {
            /**
             * 需要禁用的 id
             */
            disabledId() {
                return getFieldsValue(this.$parent.list, {
                    parentId: this.record.id
                });
            },
            /**
             * 上级分类
             */
            treeData() {
                return [{
                    title: '无',
                    value: '0',
                    key: '0',
                }, ...changeKeys(this.$parent.list, {
                    title: "name",
                    value: "id",
                    key: "id",
                    children: "children",
                    disabled: (record) => {
                        return this.disabledId.includes(record.id);
                    }
                })];
            }
        },
        methods: {
            /**
             * 新增
             */
            handleInsert(record) {
                this.toggleModal();
                this.title = '新增分类';
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        parent_id: record ? record.id : '0'
                    });
                });
            },
            /**
             * 编辑
             */
            handleEdit(record) {
                this.toggleModal();
                this.record = record;
                this.title = '编辑分类';
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        parent_id: record.parent_id,
                        name: record.name,
                        status: record.status,
                        sort: record.sort
                    });
                });
            },
            /**
             * 删除
             * @param record
             */
            handleDelete(record) {
                this.$api.mall.category.delete({
                    id: record.id
                }).then(({code}) => {
                    if (code === '200') {
                        this.$emit('delete', record);
                        this.$emit('complete', record);
                    }
                });
            },
            /**
             * 确认
             */
            onOk() {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        this.confirmLoading = true;
                        this.$api.mall.category.submit({
                            id: this.record.id,
                            name: values.name,
                            parent_id: values.parent_id || '0',
                            status: values.status,
                            sort: values.sort
                        }).then(({code}) => {
                            this.confirmLoading = false;
                            if (code === '200') {
                                this.reset();
                                this.toggleModal();
                                this.$emit('ok', values);
                                this.$emit('complete', values);
                            }
                        }, err => {
                            this.confirmLoading = false;
                        });
                    }
                });
            },
            /**
             * 取消
             */
            onCancel() {
                this.reset();
                this.toggleModal();
                this.$emit('cancel');
            }
        }
    };
</script>

<style scoped>

</style>