<template>
    <div>
        <a-card :bordered="false">
            <div class="g-margin-bottom-2" v-action:insert>
                <a-button type="primary" icon="plus" @click="$refs.editForm.handleInsert()">新增部门</a-button>
            </div>
            <a-table :columns="columns"
                     :data-source="list"
                     :loading="loading"
                     :pagination="false"
                     default-expand-all-rows
                     row-key="id"
                     size="middle">
                <template slot="status" slot-scope="text">
                    <x-status :code="text"></x-status>
                </template>
                <template slot="operation" slot-scope="text,record">
                    <span v-action:insertNext>
                        <a @click="$refs.editForm.handleInsert(record)">新增下级</a>
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
            title: '状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'}
        },
        {
            title: '排序',
            dataIndex: 'sort'
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
    ]
    export default {
        name: "index",
        components: {
            EditForm
        },
        data() {
            return {
                columns,
                loading: false,
                list: []
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
                this.$api.system.dept.getList().then(({code, data: {list}}) => {
                    this.loading = false
                    if (code === '200') {
                        this.list = list
                    }
                }).catch(() => {
                    this.loading = false
                })
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
