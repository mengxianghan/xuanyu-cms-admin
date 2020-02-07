<template>
    <div>
        <a-card :bordered="false">
            <div class="g-margin-bottom-2" v-action:insert>
                <a-button type="primary" icon="plus" @click="$refs.editForm.handleInsert()">新增商品</a-button>
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
                    <span v-action:edit>
                        <a @click="$refs.editForm.handleEdit(record)">设价</a>
                        <a-divider type="vertical"></a-divider>
                    </span>
                    <span v-action:edit>
                        <a @click="$refs.editForm.handleEdit(record)">下架</a>
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
            title: '商品名称/规格',
            dataIndex: 'name'
        },
        {
            title: '商品编码/条码',
            dataIndex: '1'
        },
        {
            title: '商品分类',
            dataIndex: '2'
        },
        {
            title: '销售价',
            dataIndex: '3',
            sorter: true
        },
        {
            title: '供货价',
            dataIndex: '4'
        },
        {
            title: '级别价',
            dataIndex: '5'
        },
        {
            title: '库存',
            dataIndex: '6',
            sorter: true
        },
        {
            title: '单位',
            dataIndex: '7'
        },
        {
            title: '销量',
            dataIndex: '8',
            sorter: true
        },
        {
            title: '是否超卖',
            dataIndex: '9'
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
                this.$api.mall.goods.getList({
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
