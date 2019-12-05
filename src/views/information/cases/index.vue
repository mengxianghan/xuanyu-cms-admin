<template>
    <div>
        <a-row :gutter="16">
            <a-col :md="5" :xs="24">
                <a-card :bordered="false">
                    <x-infor-column ref="informationColumn"
                                          :selected-keys="selectedKeys"
                                          @select="handleSelect"></x-infor-column>
                </a-card>
            </a-col>
            <a-col :md="19" :xs="24">
                <a-card :bordered="false">
                    <div class="table-page-search g-margin-bottom-2">
                        <a-form layout="inline">
                            <a-row :gutter="16">
                                <a-col :span="8">
                                    <a-form-item label="标题">
                                        <a-input v-model="searchForm.title"
                                                 allow-clear></a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item>
                                        <a-button type="primary"
                                                  ghost
                                                  @click="handleSearch">
                                            <a-icon type="search"/>
                                            搜索
                                        </a-button>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-form>
                    </div>
                    <div class="g-margin-bottom-2" v-action:insert>
                        <a-button type="primary" icon="plus" @click="$refs.editForm.handleInsert()">新增新闻</a-button>
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
    </div>
</template>

<script>
    import EditForm from './edit-form';
    import {changeKeys, getFieldsValue} from '@/utils/util';

    const columns = [
        {
            title: '标题',
            dataIndex: 'title'
        },
        {
            title: "所属栏目",
            dataIndex: 'column_name'
        },
        {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'}
        },
        {
            title: '创建时间',
            dataIndex: 'create_time'
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
            EditForm
        },
        data() {
            return {
                searchForm: {},
                columns,
                columnId: '',
                selectedKeys: [],
                list: [],
                pagination: {
                    showSizeChanger: true
                },
                loading: false
            };
        },
        created() {
            this.getList();
        },
        methods: {
            /**
             * 获取列表
             */
            getList() {
                this.loading = true;
                this.$api.information.news.getList({
                    search: JSON.stringify(this.searchForm),
                    column_id: this.columnId,
                    current_page: this.pagination.current,
                    page_size: this.pagination.pageSize
                }).then(({code, data: {list, total}}) => {
                    this.loading = false;
                    if (code == '0') {
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
             * 选择栏目
             * @param selectedKeys
             */
            handleSelect(selectedKeys) {
                const columnId = getFieldsValue(this.$refs.informationColumn.list, {
                    parentField: 'parent_id',
                    parentId: selectedKeys[0] || '',
                    field: 'id'
                }).join(',');
                this.columnId = columnId;
                this.selectedKeys = selectedKeys;
                this.getList();
            },
            /**
             * 搜索
             */
            handleSearch() {
                this.getList();
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
            }
        }
    };
</script>

<style scoped>

</style>