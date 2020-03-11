<template>
    <a-row :gutter="8">
        <a-col :span="8">
            <a-select allow-clear
                      :value="standard"
                      @change="handleChange">
                <a-select-option v-for="item in list"
                                 :key="item.id">{{item.name}}
                </a-select-option>
            </a-select>
        </a-col>
        <a-col :span="16">
            <a-select mode="multiple"
                      allow-clear
                      :value="standardValue"
                      @change="handelValueChange">
                <a-select-option v-for="item in valueList"
                                 :key="item.id">{{item.name}}
                </a-select-option>
            </a-select>
        </a-col>
    </a-row>
</template>

<script>
    export default {
        name: "XStandard",
        props: {
            value: ''
        },
        data() {
            return {
                current: {
                    label: '',
                    value: '',
                    children: []
                },
                list: [],
                valueList: []
            }
        },
        mounted() {
            this.getStandardList()
        },
        watch: {
            value(val) {
                if (val instanceof Object) {
                    this.current = {
                        label: val.label,
                        value: val.value,
                        children: val.children
                    }
                }
            }
        },
        computed: {
            standard() {
                return this.current.value
            },
            standardValue() {
                return this.current.children.map(item => item.value)
            }
        },
        methods: {
            /**
             * 获取商品规格列表
             * @returns {Promise<void>}
             */
            async getStandardList(parentId = '0') {
                const {code, data: {list}} = await this.$api.mall.standard.getList({
                    parent_id: parentId,
                    status: '1',
                    has_pagination: '0'
                })
                if (code === '200') {
                    if (parentId === '0') {
                        this.list = list
                    } else {
                        this.valueList = list
                    }
                }
            },
            /**
             * 改变商品规格
             * @param value
             * @param option
             */
            handleChange(value, option) {
                if (value) {
                    this.current = {
                        label: option.componentOptions.children[0].text,
                        value: value,
                        children: []
                    }
                    this.getStandardList(value)
                } else {
                    this.valueList = []
                }
            },
            /**
             * 改变商品规格值
             * @param value
             * @param option
             */
            handelValueChange(value, option) {
                let children = []
                if (value && value.length) {
                    children = value.map((item, index) => {
                        return {
                            label: option[index].componentOptions.children[0].text,
                            value: item
                        }
                    })
                }
                this.$set(this.current, 'children', children)
                this.$emit('input', this.current)
                this.$emit('change', this.current)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
