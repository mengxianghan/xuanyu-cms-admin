<template>
    <div>
        <a-row :gutter="16">
            <a-col :md="5" :xs="24">
                <a-card :bordered="false">
                    <a-spin :spinning="!treeData.length">
                        <div>
                            <a-tree :tree-data="treeData"
                                    default-expand-all
                                    @select="handleSelect"
                                    v-if="treeData.length"></a-tree>
                        </div>
                    </a-spin>
                </a-card>
            </a-col>
            <a-col :md="19" :xs="24">
                <a-card :bordered="false">
                    <div class="g-margin-bottom-2" v-action:insert>
                        <a-button type="primary" icon="plus" @click="$refs.editForm.handleInsert()">新增用户</a-button>
                    </div>
                    <a-table :columns="columns"
                             :data-source="list"
                             :pagination="pagination"
                             :loading="loading"
                             row-key="id"
                             size="middle"
                             @change="handleTableChange">
                        <template slot="status" slot-scope="text">
                            <x-status :code="text"></x-status>
                        </template>
                        <template slot="operation" slot-scope="text,record">
                            <span v-action:setAuth>
                                <a-tooltip title="超级管理员拥有所有权限" trigger="click" v-if="record.type === '1'">
                                    <a>设置权限</a>
                                </a-tooltip>
                                <a @click="$refs.authForm.handleEdit(record)" v-else>设置权限</a>
                                <a-divider type="vertical"></a-divider>
                            </span>
                            <span v-action:edit>
                                <a @click="$refs.editForm.handleEdit(record)">编辑</a>
                                <a-divider type="vertical"></a-divider>
                            </span>
                            <span v-action:delete>
                                <a-popconfirm title="确认删除此数据?"
                                              @confirm="$refs.editForm.handleDelete(record)">
                                    <a>删除</a>
                                </a-popconfirm>
                            </span>
                        </template>
                    </a-table>
                </a-card>
            </a-col>
        </a-row>
        <edit-form ref="editForm" @complete="onComplete"></edit-form>
        <auth-form ref="authForm" type="2"></auth-form>
    </div>
</template>

<script>
    import EditForm from './edit-form';
    import AuthForm from './../role/auth-form';
    import {changeKeys, getFieldsValue} from '@/utils/util';

    const columns = [
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '姓名',
            dataIndex: 'full_name'
        },
        {
            title: '角色',
            dataIndex: 'role_name'
        },
        {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'}
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'}
        }
    ];
    export default {
        name: "index",
        components: {
            EditForm,
            AuthForm
        },
        data() {
            return {
                columns,
                list: [],
                pagination: {
                    showSizeChanger: true
                },
                loading: false,
                deptList: [],
                deptId: ''
            };
        },
        created() {
            this.getDeptList();
            this.getList();
        },
        computed: {
            treeData() {
                return changeKeys(this.deptList, {
                    title: 'name',
                    value: 'id',
                    key: 'id',
                    children: 'children',
                    parentId: 'parent_id'
                });
            },
        },
        methods: {
            /**
             * 获取列表
             */
            getList() {
                this.loading = true;
                this.$api.system.user.getList({
                    current_page: this.pagination.current,
                    page_size: this.pagination.pageSize,
                    dept_id: this.deptId
                }).then(({code, data: {list, total}}) => {
                    this.loading = false;
                    if (code === '200') {
                        this.pagination = {
                            ...this.pagination,
                            total: Number(total),
                        };
                        this.list = list;
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            /**
             * 获取部门列表
             */
            getDeptList() {
                this.deptLoading = true;
                this.$api.system.dept.getList({
                    status: '1'
                }).then(({code, data: {list}}) => {
                    this.deptLoading = false;
                    if (code === '200') {
                        this.deptList = list;
                    }
                }).catch(() => {
                    this.deptLoading = false;
                });
            },
            /**
             * 分页
             * @param pagination
             */
            handleTableChange(pagination) {
                this.pagination = {
                    ...this.pagination,
                    current: pagination.current,
                    pageSize: pagination.pageSize
                };
                this.getList();
            },
            /**
             * 选择部门
             */
            handleSelect(selectedKeys) {
                this.deptId = getFieldsValue(this.treeData, {
                    parentField: 'parentId',
                    parentId: selectedKeys[0] || '',
                    field: 'key'
                }).join(',');
                this.getList();
            },
            /**
             * 完成
             */
            onComplete() {
                this.getList();
            }
        }
    };
</script>

<style scoped>

</style>