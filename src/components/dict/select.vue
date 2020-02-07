<template>
    <a-select :value="value"
              :allow-clear="allowClear"
              :show-search="showSearch"
              :mode="mode"
              :filter-option="filterOption"
              @change="handleChange">
        <a-select-option v-for="item in list" :key="item.key">{{item.name}}</a-select-option>
    </a-select>
</template>

<script>
    import {form} from '@/utils/mixin'

    export default {
        name: "XDictSelect",
        props: {
            value: '',
            dict: {
                type: String,
                default: ''
            },
            allowClear: {
                type: Boolean,
                default: false
            },
            showSearch: {
                type: Boolean,
                default: false
            },
            mode: {
                type: String,
                default: 'default'
            }
        },
        mixins: [form],
        data() {
            return {
                list: []
            }
        },
        mounted() {
            this.getList(this.dict)
        },
        methods: {
            /**
             * 获取列表
             * @returns {Promise<void>}
             */
            async getList(key) {
                if (!key) return
                const {code, data: {list}} = await this.$api.system.dict.getList({
                    status: '1',
                    dict_dir_key: key,
                    has_pagination: '0'
                })
                if (code === '200') {
                    this.list = list
                }
            },
            /**
             * 改变选中
             */
            handleChange(value) {
                this.$emit('change', value)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
