<template>
    <div>
        <a-card :bordered="false">
            <div class="g-mb-2" v-action:insert>
                <a-button type="primary" icon="plus" @click="$refs.editForm.handleInsert()">
                    <template v-if="isFirst">
                        新增规格
                    </template>
                    <template v-else>
                        新增规格值
                    </template>
                </a-button>
            </div>
            <a-breadcrumb class="g-mb-2">
                <a-breadcrumb-item v-if="!isFirst">
                    <a @click="handleBack">
                        <a-icon type="rollback"/>
                        <span>返回</span>
                    </a>
                </a-breadcrumb-item>
                <a-breadcrumb-item>
                    <a @click="handleAll">
                        全部规格
                    </a>
                </a-breadcrumb-item>
                <a-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">
                    <router-link :to="item.to">{{item.title}}</router-link>
                </a-breadcrumb-item>
            </a-breadcrumb>
            <a-table :columns="columns"
                     :data-source="list"
                     :loading="loading"
                     :pagination="pagination"
                     row-key="id"
                     size="middle"
                     @change="handleTableChange">
                <template slot="status" slot-scope="text">
                    <x-status :code="text"></x-status>
                </template>
                <template slot="operation" slot-scope="text,record">
                    <span v-if="isFirst">
                        <a @click="handleAttr(record)">管理规格值</a>
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
            title: '操作',
            dataIndex: 'operation',
            width: '200px',
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
                parentId: '0',
                breadcrumb: [],
                list: [],
                pagination: {
                    showSizeChanger: true
                },
                loading: false
            }
        },
        created() {
            this.parentId = this.$route.query.parent_id
        },
        computed: {
            /**
             * 是否第一级
             */
            isFirst() {
                return (
                    this.parentId == '0' || typeof this.parentId == 'undefined'
                )
            },
            /**
             * 路由名称
             */
            routeName() {
                return this.$route.name
            }
        },
        watch: {
            '$route'(val) {
                this.parentId = val.query.parent_id
            },
            parentId() {
                this.pagination = {
                    ...this.pagination,
                    current: 1,
                    pageSize: this.pagination.pageSize
                }
                this.getList()
            }
        },
        methods: {
            /**
             * 获取列表
             */
            getList() {
                this.loading = true
                this.$api.mall.standard.getList({
                    parent_id: this.parentId,
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
             * 属性管理
             */
            handleAttr(record) {
                this.$router.push({
                    name: this.routeName,
                    query: {
                        parent_id: record.id
                    }
                })
                //设置面包屑导航
                this.breadcrumb.push({
                    title: record.name,
                    to: {
                        name: this.routeName,
                        query: {
                            parent_id: record.id
                        }
                    }
                })
            },
            /**
             * 返回上一页
             */
            handleBack() {
                this.$router.back()
                //设置面包屑导航
                this.breadcrumb.pop()
            },
            /**
             * 全部规格
             */
            handleAll() {
                this.$router.push({
                    name: this.routeName
                })
                //重置面包屑导航
                this.breadcrumb = []
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
