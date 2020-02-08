<template>
    <div>
        <a-card :bordered="false">
            <div class="g-mb-2" v-action:insert>
                <a-button type="primary" icon="plus" @click="$refs.editForm.handleInsert()">新增按钮</a-button>
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

        <edit-form ref="editForm" @complete="onComplete"></edit-form>
    </div>
</template>

<script>
    import EditForm from './edit-form'

    const columns = [
        {
            title: '名称',
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
            title: '排序',
            dataIndex: 'sort'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'}
        }
    ]
    export default {
        name: "index",
        components: {
            EditForm
        },
        data() {
            return {
                columns,
                list: [],
                pagination: {
                    showSizeChanger: true
                },
                loading: false
            }
        },
        created() {
            this.getList()
        },
        methods: {
            /**
             * 获取列表
             */
            getList() {
                this.loading = true
                this.$api.system.authButton.getList({
                    current_page: this.pagination.current,
                    page_size: this.pagination.pageSize
                }).then(({code, data: {list, total}}) => {
                    this.loading = false
                    if (code === '200') {
                        this.pagination = {
                            ...this.pagination,
                            total: Number(total),
                        }
                        this.list = list
                    }
                }).catch(() => {
                    this.loading = false
                })
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
                }
                this.getList()
            },
            /**
             * 完成
             */
            onComplete() {
                this.getList()
            }
        }
    }
</script>

<style scoped>

</style>
