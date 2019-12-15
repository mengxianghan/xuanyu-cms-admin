<template>
    <a-modal v-model="visible"
             :title="title"
             :confirm-loading="confirmLoading"
             width="640px"
             @ok="onOk"
             @cancel="onCancel">
        <a-spin :spinning="spinning">
            <a-tree class="auth-tree"
                    :tree-data="list"
                    default-expand-all
                    checkable
                    :check-strictly="false"
                    @check="onCheck"
                    v-model="checkedKeys"
                    v-if="list.length"></a-tree>
        </a-spin>
    </a-modal>
</template>

<script>
    import {form} from '@/utils/mixin';
    import {changeKeys} from "@/utils/util";

    /**
     * 格式化菜单列表
     */
    const formatMenuList = (list) => {
        return changeKeys(list, {
            title: 'name',
            value: 'id',
            key: 'id',
            children: (record) => {
                if (record.children && record.children.length) {
                    return formatMenuList(record.children);
                } else {
                    if (record.auth_id) {
                        const authId = record.auth_id.split(',');
                        const authName = record.auth_name.split(',');
                        return authName.map((item, index) => {
                            return {
                                class: 'last-tree-node',
                                title: item,
                                value: `${record.id},${authId[index]}`,
                                key: `${record.id},${authId[index]}`
                            };
                        });
                    }
                }
            }
        });
    };

    export default {
        props: {
            type: {
                type: [Number, String],
                default: 1
            }
        },
        mixins: [form],
        data() {
            return {
                list: [],
                spinning: false,
                checkedKeys: [],
                halfCheckedKeys: []
            };
        },
        created() {
            this.title = '设置权限';
        },
        watch: {
            visible(val) {
                if (val && !this.list.length) {
                    this.getMenuList();
                }
            }
        },
        methods: {
            /**
             * 获取当前登录用户的权限列表
             * @returns {Promise<void>}
             */
            getMenuList() {
                this.spinning = true;
                const {id: userId} = this.$ls.get('userInfo');
                this.$api.system.auth.getMenuList({
                    id: userId,
                    type: '2'
                }).then(({code, data: {list}}) => {
                    this.spinning = false;
                    if (code === '0') {
                        this.list = formatMenuList(list);
                    }
                });
            },
            /**
             * 获取已有权限列表
             */
            async getAlreadyAuthList() {
                this.spinning = true;
                const {code, data: {list}} = await this.$api.system.auth.getAlreadyAuthList({
                    id: this.record.id,
                    type: this.type
                });
                this.spinning = false;
                if (code === '0') {
                    let checkedKeys = [];
                    let halfCheckedKeys = [];
                    list.forEach(item => {
                        halfCheckedKeys.push(item.menu_id);
                        if (item.auth_button_id) {
                            item.auth_button_id.split(',').forEach(authItem => {
                                checkedKeys.push(`${item.menu_id},${authItem}`);
                            });
                        }
                    });
                    this.checkedKeys = checkedKeys;
                    this.halfCheckedKeys = halfCheckedKeys;
                }
            },
            /**
             * 设置权限
             */
            handleEdit(record) {
                this.toggleModal();
                this.record = record;
                this.getAlreadyAuthList();
            },
            /**
             * 点击复选框触发
             * @param checkedKeys
             * @param e
             */
            onCheck(checkedKeys, e) {
                const {halfCheckedKeys} = e;
                this.halfCheckedKeys = halfCheckedKeys;
            },
            /**
             * 确认
             */
            onOk() {
                this.confirmLoading = true;
                const values = [...this.formatValues(this.checkedKeys), ...this.formatValues(this.halfCheckedKeys, '1')];
                this.$api.system.auth.submit({
                    id: this.record.id,
                    type: this.type,
                    values: values
                }).then(({code}) => {
                    this.confirmLoading = false;
                    if (code === '0') {
                        this.reset();
                        this.toggleModal();
                        this.$emit('ok');
                    }
                });
            },
            /**
             * 取消
             */
            onCancel() {
                this.reset();
                this.toggleModal();
                this.$emit('cancel');
            },
            /**
             * 格式化提交数据
             * @returns array
             */
            formatValues(list, isHalf = '0') {
                const values = list.map(item => {
                    const arr = item.split(',');
                    const menuId = arr.length == 2 ? arr[0] : item;
                    const authButtonId = arr.length == 2 ? arr[1] : '';
                    return {
                        id: this.record.id,
                        type: this.type,
                        menu_id: menuId,
                        auth_button_id: authButtonId,
                        is_half: isHalf
                    };
                });
                return values;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .auth-tree {
        /deep/ {
            .ant-tree-child-tree {
                &:after {
                    content: '';
                    clear: both;
                    display: table;
                }

                .last-tree-node {
                    float: left;
                    padding: 8px 0 4px;
                }
            }
        }
    }
</style>