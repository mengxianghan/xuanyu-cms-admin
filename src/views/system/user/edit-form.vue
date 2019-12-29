<template>
    <a-modal v-model="visible"
             :title="title"
             :confirm-loading="confirmLoading"
             @ok="onOk"
             @cancel="onCancel">
        <a-form :form="form"
                v-bind="formItemLayout">
            <a-form-item label="用户名">
                <a-input v-decorator="['username',{rules:[{required:true,message:'请输入用户名'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="密码"
                         :extra="isRequiredPassword ? '' : '不填写则不修改'">
                <a-input-password
                        v-decorator="['password',{rules:[{required:isRequiredPassword,message:'请输入密码'},{validator:verifyPassword}]}]"
                        allow-clear></a-input-password>
            </a-form-item>
            <a-form-item label="角色">
                <a-select v-decorator="['role_id',{rules:[{required:true,message:'请输入选择角色'}]}]"
                          mode="multiple"
                          :loading="roleLoading">
                    <a-select-option v-for="item in roleList" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="部门">
                <a-tree-select :tree-data="treeData"
                               tree-default-expand-all
                               v-decorator="['dept_id']"></a-tree-select>
            </a-form-item>
            <a-form-item label="岗位">
                <a-select v-decorator="['post_id']"
                          :loading="postLoading">
                    <a-select-option v-for="item in postList"
                                     :key="item.id">{{item.name}}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="姓名">
                <a-input v-decorator="['full_name']"></a-input>
            </a-form-item>
            <a-form-item label="手机">
                <a-input v-decorator="['mobile']"></a-input>
            </a-form-item>
            <a-form-item label="邮箱">
                <a-input v-decorator="['email']"></a-input>
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
    import {form} from '@/utils/mixin';

    export default {
        mixins: [form],
        data() {
            return {
                roleList: [],
                roleLoading: false,
                postList: [],
                postLoading: false,
                isRequiredPassword: false
            };
        },
        watch: {
            visible(val) {
                if (val) {
                    if (!this.roleList.length) {
                        this.getRoleList();
                    }
                    if (!this.postList.length) {
                        this.getPostList();
                    }
                }
            }
        },
        computed: {
            treeData() {
                return this.$parent.treeData;
            },
            /**
             * 是否超级管理员
             */
            isSuper() {
                return this.record.type === '1' ? true : false;
            }
        },
        methods: {
            /**
             * 验证密码
             * @param rule
             * @param value
             * @param callback
             */
            verifyPassword(rule, value, callback) {
                if (value) {
                    if (value.trim().length < 6) {
                        callback('密码长度至少6位');
                    }
                }
                callback();
            },
            /**
             * 获取角色
             */
            async getRoleList() {
                this.roleLoading = true;
                const {code, data: {list}} = await this.$api.system.role.getList({
                    status: '1',
                    has_pagination: '0'
                });
                this.roleLoading = false;
                if (code === '200') {
                    this.roleList = list;
                }
            },
            /**
             * 获取岗位
             */
            async getPostList() {
                this.postLoading = true;
                const {code, data: {list}} = await this.$api.system.post.getList({
                    status: '1',
                    has_pagination: '0'
                });
                this.postLoading = false;
                if (code === '200') {
                    this.postList = list;
                }
            },
            /**
             * 新增
             */
            handleInsert() {
                this.toggleModal();
                this.title = '新增';
                this.$nextTick(() => {
                    const deptId = this.$parent.deptId.split(',').length ? this.$parent.deptId.split(',')[0] : '';
                    this.isRequiredPassword = true;
                    this.form.setFieldsValue({
                        dept_id: deptId
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
                    this.isRequiredPassword = false;
                    this.form.setFieldsValue({
                        username: record.username,
                        role_id: record.role_id,
                        dept_id: record.dept_id,
                        post_id: record.post_id,
                        full_name: record.full_name,
                        mobile: record.mobile,
                        email: record.email,
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
                this.$api.system.user.delete({
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
                        this.$api.system.user.submit({
                            id: this.record.id,
                            username: values.username,
                            password: values.password,
                            role_id: values.role_id,
                            dept_id: values.dept_id,
                            post_id: values.post_id,
                            full_name: values.full_name,
                            mobile: values.mobile,
                            email: values.email,
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