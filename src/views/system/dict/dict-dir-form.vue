<template>
    <a-modal v-model="visible"
             :title="title"
             :confirm-loading="confirmLoading"
             @ok="onOk"
             @cancel="onCancel">
        <a-form :form="form"
                v-bind="formItemLayout">
            <a-form-item label="所属目录">
                <a-tree-select v-decorator="['parent_id',{rules:[{required:true,message:'请选择所属目录'}]}]"
                               :tree-data="treeData"></a-tree-select>
            </a-form-item>
            <a-form-item label="字典目录名称">
                <a-input v-decorator="['name',{rules:[{required:true,message:'请输入字典目录名称'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="Key">
                <a-input v-decorator="['key',{rules:[{required:true,message:'请输入Key'}]}]"></a-input>
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
        created() {
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
             * 上级目录
             */
            treeData() {
                return changeKeys(this.$parent.dictDirList, {
                    title: "name",
                    value: "id",
                    key: "id",
                    children: "children",
                    disabled: (record) => {
                        return this.disabledId.includes(record.id);
                    }
                });
            }
        },
        methods: {
            /**
             * 新增
             */
            handleInsert(record) {
                this.toggleModal();
                this.title = '新增';
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        parent_id: record.parent_id
                    });
                });
            },
            /**
             * 新增下级
             */
            handleInsertNext(record) {
                this.toggleModal();
                this.title = '新增下级';
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        parent_id: record.id
                    });
                });
            },
            /**
             * 编辑
             * @param record
             */
            handleEdit(record) {
                this.toggleModal();
                this.record = record;
                this.title = '编辑';
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        parent_id: record.parent_id,
                        name: record.name,
                        key: record.key,
                        sort: record.sort
                    });
                });
            },
            /**
             * 删除
             */
            handleDelete(record) {
                this.$api.system.dictDir.delete({
                    id: record.id
                }).then(({code}) => {
                    if (code === '0') {
                        this.$emit('delete', record);
                    }
                });
            },
            /**
             * 确认
             */
            onOk() {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        const isUpdateDirKey = Object.keys(this.record).length && values.key !== this.record.key ? '1' : '0';
                        this.confirmLoading = true;
                        this.$api.system.dictDir.submit({
                            id: this.record.id,
                            parent_id: values.parent_id,
                            name: values.name,
                            key: values.key,
                            is_update_dir_key: isUpdateDirKey,
                            sort: values.sort
                        }).then(({code}) => {
                            this.confirmLoading = false;
                            if (code === '0') {
                                this.reset();
                                this.toggleModal();
                                this.$emit('ok');
                            }
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