<template>
    <div>
        <a-card :bordered="false">
            <a-row :gutter="16"
                   type="flex">
                <a-col :md="5" :xs="24">
                    <a-menu mode="inline"
                            :defaultSelectedKeys="['0']"
                            :open-keys.sync="openKeys"
                            class="log-menu">
                        <a-menu-item key="0">全部日志</a-menu-item>
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
                    </a-table>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<script>
    const columns = [
        {
            title: '用户名',
            dataIndex: 'name'
        },
        {
            title: '请求接口',
            dataIndex: 'api'
        },
        {
            title: '参数',
            dataIndex: 'params'
        },
        {
            title: '浏览器',
            dataIndex: 'browser'
        },
        {
            title: 'IP',
            dataIndex: 'ip'
        },
        {
            title: '时间',
            dataIndex: 'create_time'
        }
    ];
    export default {
        data() {
            return {
                columns,
                openKeys: ['0'],
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
                    page_size: this.pagination.pageSize
                }).then(({code, data: {list, total}}) => {
                    this.loading = false;
                    if (code === '0') {
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
            }
        }
    };
</script>

<style lang="scss" scoped>
    .log-menu {
        height: 100%;
    }
</style>