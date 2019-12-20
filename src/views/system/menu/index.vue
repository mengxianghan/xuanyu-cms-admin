<template>
    <div>
        <a-card :bordered="false">
            <div class="g-margin-bottom-2" v-action:insert>
                <a-button type="primary" icon="plus" @click="$refs.editForm.handleInsert()">新增菜单</a-button>
            </div>
            <a-table :columns="columns"
                             :data-source="list"
                             :loading="loading"
                             :pagination="false"
                             row-key="id"
                             size="middle"
                             v-if="list.length">
                        <template slot="hidden" slot-scope="text">
                            <a-badge v-bind="formatHidden(text)"/>
                        </template>
                        <template slot="status" slot-scope="text">
                            <x-status :code="text"></x-status>
                        </template>
                        <template slot="operation" slot-scope="text,record">
                                <span v-action:insertNext>
                                    <a @click="$refs.editForm.handleInsert(record)">新增下级</a>
                                    <a-divider type="vertical"></a-divider>
                                </span>
                            <span v-action:copy>
                                    <a @click="$refs.editForm.handleCopy(record)">复制</a>
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
    import EditForm from './edit-form';

    const columns = [
        {
            title: '菜单名称',
            dataIndex: 'name'
        },
        {
            title: '路由地址',
            dataIndex: 'route_path'
        },
        {
            title: '路由名称',
            dataIndex: 'route_name'
        },
        {
            title: '菜单',
            dataIndex: 'hidden',
            scopedSlots: {customRender: 'hidden'}
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
    ];
    export default {
        name: "index",
        components: {
            EditForm
        },
        data() {
            return {
                columns,
                list: [],
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
                this.$api.system.menu.getList().then(({code, data: {list}}) => {
                    this.loading = false;
                    if (code === '200') {
                        this.list = list;
                    }
                }).catch(() => {
                    this.loading = false;
                });
            },
            /**
             * 格式化隐藏菜单
             */
            formatHidden(value) {
                if (value === '1') {
                    return {
                        status: 'error',
                        text: '隐藏'
                    };
                } else {
                    return {
                        status: 'processing',
                        text: '显示'
                    };
                }
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
