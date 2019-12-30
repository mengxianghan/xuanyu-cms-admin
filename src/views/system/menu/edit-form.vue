<template>
    <a-modal v-model="visible"
             :title="title"
             :confirm-loading="confirmLoading"
             @ok="onOk"
             @cancel="onCancel">
        <a-form :form="form"
                v-bind="formItemLayout">
            <a-form-item label="上级菜单">
                <a-tree-select :tree-data="treeData"
                               v-decorator="['parent_id',{rules:[{required:true,message:'请选择上级菜单'}]}]"></a-tree-select>
            </a-form-item>
            <a-form-item label="名称">
                <a-input v-decorator="['name',{rules:[{required:true,message:'请输入名称'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="图标">
                <a-input v-decorator="['icon']"></a-input>
            </a-form-item>
            <a-form-item label="路由地址"
                         extra="支持外部链接，例：http://www.域名.com">
                <a-input v-decorator="['route_path']"></a-input>
            </a-form-item>
            <a-form-item label="路由名称">
                <a-input v-decorator="['route_name',{rules:[{required:true,message:'请输入路由名称'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="路由页面">
                <a-input v-decorator="['route_component']"></a-input>
            </a-form-item>
            <a-form-item label="权限按钮">
                <a-select v-decorator="['auth_button_id']"
                          mode="multiple">
                    <a-select-option v-for="(item) in authButtonList" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="隐藏菜单">
                <a-switch v-decorator="['hidden',{valuePropName:'checked'}]"/>
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
    import {
        getFieldsValue,
        changeKeys,
        stringToArray,
        arrayToString,
        booleanToString,
        stringToBoolean
    } from "@/utils/util";

    const targetList = [
        {
            label: '框架页',
            key: '1'
        }
    ];
    export default {
        mixins: [form],
        data() {
            return {
                targetList,
                authButtonList: []
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
             * 上级菜单
             */
            treeData() {
                return [{
                    title: '无',
                    value: '0',
                    key: '0'
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
        watch: {
            visible(val) {
                if (val) {
                    this.getAuthButtonList();
                }
            },
        },
        methods: {
            /**
             * 获取权限按钮列表
             */
            async getAuthButtonList() {
                const {code, data: {list}} = await this.$api.system.authButton.getList({
                    status: '1'
                });
                if (code === '200') {
                    this.authButtonList = list;
                }
            },
            /**
             * 新增
             */
            handleInsert(record) {
                this.toggleModal();
                this.title = '新增菜单';
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        parent_id: record ? record.id : '0'
                    });
                });
            },
            /**
             * 复制
             */
            handleCopy(record) {
                this.handleEdit(record);
                this.record = {};
                this.title = '复制菜单';
            },
            /**
             * 编辑
             */
            handleEdit(record) {
                this.toggleModal();
                this.record = record;
                this.title = '编辑菜单';
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        parent_id: record.parent_id,
                        name: record.name,
                        icon: record.icon,
                        route_path: record.route_path,
                        route_name: record.route_name,
                        route_component: record.route_component,
                        auth_button_id: stringToArray(record.auth_button_id),
                        hidden: stringToBoolean(record.hidden),
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
                this.$api.system.menu.delete({
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
                        this.$api.system.menu.submit({
                            id: this.record.id,
                            parent_id: values.parent_id,
                            name: values.name,
                            icon: values.icon,
                            route_path: values.route_path,
                            route_name: values.route_name,
                            route_component: values.route_component,
                            auth_button_id: arrayToString(values.auth_button_id),
                            hidden: booleanToString(values.hidden),
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