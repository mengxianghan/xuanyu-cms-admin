<template>
    <a-modal v-model="visible"
             :title="title"
             :footer="null">
        <x-description-list size="small" :col="1">
            <x-description-list-item label="日志类型">{{record.type | typeFilter}}</x-description-list-item>
            <x-description-list-item label="用户">{{record.name}}</x-description-list-item>
            <x-description-list-item label="接口地址">{{record.api}}</x-description-list-item>
            <x-description-list-item label="浏览器信息">{{record.browser}}</x-description-list-item>
            <x-description-list-item label="访问 IP">{{record.ip}}</x-description-list-item>
            <x-description-list-item label="状态码">{{record.code}}</x-description-list-item>
            <x-description-list-item label="状态信息">{{record.message || '-'}}</x-description-list-item>
            <x-description-list-item label="请求参数">
                <pre>{{JSON.parse(record.params)}}</pre>
            </x-description-list-item>
            <x-description-list-item label="请求时间">{{record.create_time}}</x-description-list-item>
        </x-description-list>
    </a-modal>
</template>

<script>
    import {form} from '@/utils/mixin'

    const type = {
        1: '登录日志',
        2: '操作日志',
        3: '异常日志',
    }
    export default {
        mixins: [form],
        data() {
            return {}
        },
        filters: {
            typeFilter(key) {
                return type[key]
            }
        },
        methods: {
            handleDetail(record) {
                this.title = '日志详情'
                this.visible = true
                this.record = record
            }
        }
    }
</script>

<style scoped>

</style>
