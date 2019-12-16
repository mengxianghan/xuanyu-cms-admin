<template>
    <a-spin :spinning="spinning">
        <div>
            <a-tree :tree-data="treeData"
                    default-expand-all
                    :selected-keys="selectedKeys"
                    @select="handleSelect"
                    v-if="treeData.length"></a-tree>
        </div>
    </a-spin>
</template>

<script>
    import {changeKeys} from "@/utils/util";

    export default {
        name: 'XInforColumn',
        props: {
            selectedKeys: {
                type: Array,
                default: () => ([])
            },
            allowDisabled: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                spinning: false,
                list: [],
                treeData: [],
            };
        },
        created() {
            this.getList();
        },
        methods: {
            /**
             * 获取列表
             */
            async getList() {
                this.spinning = true;
                const {code, data: {list}} = await this.$api.information.column.getList({
                    status: '1'
                });
                this.spinning = false;
                if (code === '200') {
                    const treeData = changeKeys(list, {
                        title: 'name',
                        value: 'id',
                        key: 'id',
                        children: 'children',
                        disabled: (record) => {
                            if (this.allowDisabled) {
                                return record.menu_id === this.$route.meta.id ? false : true;
                            }
                            return false;
                        }
                    });
                    this.list = list;
                    this.treeData = treeData;
                    this.$emit('complete', {data: list, treeData: treeData});
                }
            },
            /**
             * 获取第一个有效栏目
             */
            getFirstValidColumn(treeList) {
                if (!Array.isArray(treeList)) return [];
                for (let item of treeList) {
                    if (!item.disabled) {
                        return item;
                    } else {
                        if (item.children && item.children.length > 0) {
                            let children = this.getFirstValidColumn(item.children);
                            if (children) {
                                return children;
                            }
                        }
                    }
                }
            },
            /**
             * 选择栏目
             * @param selectedKeys
             * @param e
             */
            handleSelect(selectedKeys, e) {
                this.$emit('select', selectedKeys, e);
            }
        }
    };
</script>

<style scoped>

</style>