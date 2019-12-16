<template>
    <a-modal v-model="visible"
             :title="title"
             :confirm-loading="confirmLoading"
             @ok="onOk"
             @cancel="onCancel">
        <a-form :form="form"
                v-bind="formItemLayout">
            <a-form-item label="上级栏目">
                <a-tree-select :tree-data="treeData"
                               v-decorator="['parent_id',{rules:[{required:true,message:'请选择上级栏目'}]}]"
                               tree-default-expand-all></a-tree-select>
            </a-form-item>
            <a-form-item label="栏目名称">
                <a-input v-decorator="['name',{rules:[{required:true,message:'请输入栏目名称'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="模板">
                <a-select v-decorator="['template_id',{rules:[{required:true,message:'请选择模板'}]}]"
                          :loading="templateLoading">
                    <a-select-option v-for="item in templateList" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
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
    import {getFieldsValue, changeKeys} from '@/utils/util';

    export default {
        mixins: [form],
        data() {
            return {
                templateList: [],
                templateLoading: false
            };
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
                return [{
                    title: '主栏目',
                    value: '0',
                    key: '0',
                    children: changeKeys(this.$parent.list, {
                        title: "name",
                        value: "id",
                        key: "id",
                        children: "children",
                        disabled: (record) => {
                            return this.disabledId.includes(record.id);
                        }
                    })
                }];
            },
        },
        created() {
        },
        watch: {
            visible(val) {
                if (val && !this.templateList.length) {
                    this.getTemplateList();
                }
            }
        },
        methods: {
            /**
             * 获取模板列表
             */
            async getTemplateList() {
                this.templateLoading = true;
                const {code, data: {list}} = await this.$api.information.template.getList({
                    has_pagination: 0,
                    status: 1
                });
                this.templateLoading = false;
                if (code === '200') {
                    this.templateList = list;
                }
            },
            /**
             * 新增
             */
            handleInsert(record) {
                this.toggleModal();
                this.title = '新增';
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
                this.title = '编辑';
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        parent_id: record.parent_id,
                        name: record.name,
                        template_id: record.template_id,
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
                this.$api.information.column.delete({
                    id: record.id
                }).then(({code}) => {
                    if (code === '200') {
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
                        this.$api.information.column.submit({
                            id: this.record.id,
                            parent_id: values.parent_id,
                            name: values.name,
                            template_id: values.template_id,
                            status: values.status,
                            sort: values.sort
                        }).then(({code}) => {
                            this.confirmLoading = false;
                            if (code === '200') {
                                this.reset();
                                this.toggleModal();
                                this.$emit('ok', values);
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