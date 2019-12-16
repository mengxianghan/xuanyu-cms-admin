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
                                    v-if="treeData.length">
                                <template slot="title" slot-scope="{key,value,dirKey,parentId,sort}">
                                    <a-dropdown :trigger="['contextmenu']">
                                        <span>{{value}}</span>
                                        <a-menu slot="overlay"
                                                @click="handleDirClick({id:key,name:value,key:dirKey,parent_id:parentId,sort},$event)">
                                            <a-menu-item key="insert" v-if="parentId !== '0'"
                                                         v-action:insert>新增同级
                                            </a-menu-item>
                                            <a-menu-item key="insertNext"
                                                         v-action:insertNext>新增下级
                                            </a-menu-item>
                                            <template v-if="parentId !== '0'">
                                                <a-menu-item key="edit"
                                                             v-action:edit>编辑
                                                </a-menu-item>
                                                <a-menu-divider/>
                                                <a-menu-item key="delete"
                                                             v-action:delete><span style="color:#ff4d4f;">删除</span>
                                                </a-menu-item>
                                            </template>
                                        </a-menu>
                                    </a-dropdown>
                                </template>
                            </a-tree>
                        </div>
                    </a-spin>
                </a-card>
            </a-col>
            <a-col :md="19" :xs="24">
                <a-card :bordered="false">
                    <div class="g-margin-bottom-2"
                         v-action:insert>
                        <a-button type="primary" icon="plus" @click="$refs.editForm.handleInsert()">新增字典</a-button>
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
        <edit-form ref="editForm" @ok="onOk" @delete="onDelete"></edit-form>
        <dict-dir-form ref="dictDirForm" @ok="onDictDirOk" @delete="onDictDirDelete"></dict-dir-form>
    </div>
</template>

<script>
    import {changeKeys, getFieldsValue} from "@/utils/util";
    import EditForm from './edit-form';
    import DictDirForm from './dict-dir-form';

    const columns = [
        {
            title: '字典名称',
            dataIndex: 'name'
        },
        {
            title: 'Key',
            dataIndex: 'key'
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
            DictDirForm
        },
        data() {
            return {
                columns,
                list: [],
                pagination: {
                    showSizeChanger: true
                },
                loading: false,
                dictDirList: [],
                dictDirId: ''
            };
        },
        created() {
            this.getDictDirList();
            this.getList();
        },
        computed: {
            treeData() {
                return changeKeys(this.dictDirList, {
                    key: 'id',
                    value: 'name',
                    dirKey: 'key',
                    parentId: 'parent_id',
                    sort: 'sort',
                    children: 'children'
                }, {scopedSlots: {title: 'title'}});
            },
        },
        methods: {
            /**
             * 获取列表
             */
            getList() {
                this.loading = true;
                this.$api.system.dict.getList({
                    current_page: this.pagination.current,
                    page_size: this.pagination.pageSize,
                    dict_dir_id: this.dictDirId
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
             * 获取字典目录列表
             */
            getDictDirList() {
                this.dictDirLoading = true;
                this.$api.system.dictDir.getList({
                    status: '1'
                }).then(({code, data: {list}}) => {
                    this.dictDirLoading = false;
                    if (code === '200') {
                        this.dictDirList = list;
                    }
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
             * 删除
             * @param record
             */
            handleDelete(record) {
                this.$api.system.dict.delete({
                    id: record.id
                }).then(({code}) => {
                    if (code === '200') {
                        this.getList();
                    }
                });
            },
            /**
             * 选择目录
             */
            handleSelect(selectedKeys) {
                this.dictDirId = getFieldsValue(this.treeData, {
                    parentField: 'parentId',
                    parentId: selectedKeys[0] || '',
                    field: 'key'
                }).join(',');
                this.getList();
            },
            /**
             * 操作目录
             */
            handleDirClick(record, e) {
                switch (e.key) {
                    case 'insert': // 新增同级
                        this.$refs.dictDirForm.handleInsert(record);
                        break;
                    case 'insertNext': // 新增下级
                        this.$refs.dictDirForm.handleInsertNext(record);
                        break;
                    case 'edit': // 编辑
                        this.$refs.dictDirForm.handleEdit(record);
                        break;
                    case 'delete': // 删除
                        this.$confirm({
                            title: '确认删除此数据?',
                            onOk: () => {
                                this.$refs.dictDirForm.handleDelete(record);
                            },
                            onCancel: () => {
                            },
                        });
                        break;
                }
            },
            /**
             * 确认
             */
            onOk() {
                this.getList();
            },
            /**
             * 删除
             * @param record
             */
            onDelete(record) {
                this.getList();
            },
            /**
             * 确认--字典目录
             */
            onDictDirOk() {
                this.getDictDirList();
            },
            /**
             * 删除--字典目录
             * @param record
             */
            onDictDirDelete(record) {
                this.getDictDirList();
                if (this.dictDirId === record.id) {
                    this.dictDirId = '';
                    this.getList();
                }
            }
        }
    };
</script>

<style scoped>

</style>