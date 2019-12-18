<template>
    <div>
        <a-card :bordered="false">
            <a-row :gutter="16"
                   type="flex">
                <a-col :md="5" :xs="24">
                    <a-menu mode="inline"
                            :selectedKeys="selectedKeys"
                            @click="handleMenuClick"
                            class="log-menu">
                        <a-menu-item key="">全部日志</a-menu-item>
                        <a-menu-item key="1">登录日志</a-menu-item>
                        <a-menu-item key="2">操作日志</a-menu-item>
                        <a-menu-item key="3">异常日志</a-menu-item>
                    </a-menu>
                </a-col>
                <a-col :md="19" :xs="24">
                    <a-table :columns="columns"
                             :data-source="list"
                             :pagination="pagination"
                             :loading="loading"
                             row-key="id"
                             size="middle"
                             @change="handleTableChange">
                        <template slot="operation" slot-scope="text,record">
                            <a @click="$refs.detailModal.handleDetail(record)">详情</a>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-card>

        <detail-modal ref="detailModal"></detail-modal>
    </div>
</template>

<script>
    import DetailModal from './detail-modal';

    const columns = [
        {
            title: '用户名',
            dataIndex: 'name'
        },
        {
            title: '接口',
            dataIndex: 'api'
        },
        {
            title: 'IP',
            dataIndex: 'ip'
        },
        {
            title: '时间',
            dataIndex: 'create_time'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'}
        }
    ];
    export default {
        components: {
            DetailModal
        },
        data() {
            return {
                columns,
                selectedKeys: [''],
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
                this.$api.system.log.getList({
                    current_page: this.pagination.current,
                    page_size: this.pagination.pageSize,
                    type: this.selectedKeys[0] || ''
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
            handleMenuClick({key}) {
                this.selectedKeys = [key];
                this.getList();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .log-menu {
        height: 100%;
    }
</style>