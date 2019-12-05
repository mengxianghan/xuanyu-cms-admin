<template>
    <a-modal v-model="visible"
             :title="title"
             :confirm-loading="confirmLoading"
             @ok="onOk"
             @cancel="onCancel">
        <a-form :form="form"
                v-bind="formItemLayout">
            <a-form-item label="所属目录">
                <a-tree-select v-decorator="['dict_dir_id',{rules:[{required:true,message:'请选择所属目录'}]}]"
                               :tree-data="treeData"
                               default-expand-all></a-tree-select>
            </a-form-item>
            <a-form-item label="字典名称">
                <a-input v-decorator="['name',{rules:[{required:true,message:'请输入字典名称'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="Key">
                <a-input v-decorator="['key',{rules:[{required:true,message:'请输入Key'}]}]"></a-input>
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
    import {treeToList, changeKeys} from "@/utils/util";

    export default {
        mixins: [form],
        data() {
            return {
                dictDirKey: ''
            };
        },
        created() {
            this.form = this.$form.createForm(this, {
                onValuesChange: (_, values) => {
                    // 所属目录发生改变
                    if (values.dict_dir_id) {
                        const data = treeToList(this.$parent.dictDirList).filter(item => item.id === values.dict_dir_id);
                        if (data.length) {
                            this.dictDirKey = data[0].key;
                        } else {
                            this.dictDirKey = '';
                        }
                    }
                }
            });
        },
        computed: {
            treeData() {
                return changeKeys(this.$parent.dictDirList);
            }
        },
        methods: {
            /**
             * 新增
             */
            handleInsert() {
                this.toggleModal();
                this.title = '新增';
                this.$nextTick(() => {
                    const dictDirId = this.$parent.dictDirId.split(',').length ? this.$parent.dictDirId.split(',')[0] : '';
                    this.form.setFieldsValue({
                        dict_dir_id: dictDirId
                    });
                });
            },
            /**
             * 编辑
             */
            handleEdit(record) {
                this.toggleModal();
                this.record = record;
                this.title = '编辑';
                this.dictDirKey = record.dict_dir_key;
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        dict_dir_id: record.dict_dir_id,
                        name: record.name,
                        key: record.key,
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
                this.$api.system.dict.delete({
                    id: record.id
                }).then(({code}) => {
                    if (code == '0') {
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
                        this.confirmLoading = true;
                        this.$api.system.dict.submit({
                            id: this.record.id,
                            dict_dir_id: values.dict_dir_id,
                            dict_dir_key: this.dictDirKey,
                            name: values.name,
                            key: values.key,
                            status: values.status,
                            sort: values.sort
                        }).then(({code}) => {
                            this.confirmLoading = false;
                            if (code == 0) {
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