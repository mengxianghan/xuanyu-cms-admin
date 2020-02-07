<template>
    <div>
        <a-list :grid="grid" :data-source="list"
                :loading="loading">
            <a-list-item slot="renderItem" slot-scope="item,index">
                <template v-if="item.id===''">
                    <a-button type="dashed" icon="plus" block class="new-button"
                              @click="$refs.editForm.handleInsert()"
                              v-action:insert>新增账号
                    </a-button>
                </template>
                <template v-else>
                    <a-card hoverable class="account">
                        <a-card-meta :title="item.name">
                            <a-avatar slot="avatar"
                                      icon="wechat"
                                      size="large"
                                      style="background:#3ccb52;"/>
                            <template slot="description">
                                <x-description-list :col="1">
                                    <x-description-list-item label="微信号">{{item.account||'-'}}</x-description-list-item>
                                    <x-description-list-item label="AppId">{{item.app_id||'-'}}
                                    </x-description-list-item>
                                    <x-description-list-item label="AppSecret">{{item.app_secred||'-'}}
                                    </x-description-list-item>
                                </x-description-list>
                            </template>
                        </a-card-meta>
                        <template class="ant-card-actions" slot="actions">
                            <span @click="$refs.editForm.handleEdit(item)" v-action:edit><a-icon
                                type="edit"/>&nbsp;编辑</span>
                            <span v-action:delete>
                                <a-popconfirm title="确认删除此数据?"
                                              @confirm="$refs.editForm.handleDelete(item)">
                                    <a-icon type="delete"/>&nbsp;删除
                                </a-popconfirm>
                            </span>
                        </template>
                    </a-card>
                </template>
            </a-list-item>
        </a-list>

        <edit-form ref="editForm" @complete="onComplete"></edit-form>
    </div>
</template>

<script>
    import EditForm from './edit-form'

    const grid = {gutter: 16, column: 3, xs: 1, sm: 1, md: 2, lg: 3}
    export default {
        components: {
            EditForm
        },
        data() {
            return {
                grid,
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
                this.$api.wechat.account.getList({
                    has_pagination: 0
                }).then(({code, data: {list, total}}) => {
                    this.loading = false
                    if (code === '200') {
                        this.list = [{id: ''}, ...list]
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
        },
    }
</script>

<style lang="scss" scoped>
    .new-button {
        height: 211px;
    }

    .account {
        /deep/ .description-list {
            .label,
            .content {
                padding-bottom: 0 !important;
                padding-top: 8px;
            }
        }
    }
</style>
