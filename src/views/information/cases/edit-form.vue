<template>
    <a-modal v-model="visible"
             :title="title"
             :confirm-loading="confirmLoading"
             :width="1200"
             @ok="onOk"
             @cancel="onCancel">
        <a-form :form="form"
                v-bind="formItemLayout">
            <a-row>
                <a-col :span="16">
                    <a-form-item label="标题">
                        <a-input v-decorator="['title',{rules:[{required:true,message:'请输入标题'}]}]"></a-input>
                    </a-form-item>
                    <a-form-item label="副标题">
                        <a-input v-decorator="['sub_title']"></a-input>
                    </a-form-item>
                    <a-form-item label="SEO关键词">
                        <a-textarea v-decorator="['seo_keywords']"></a-textarea>
                    </a-form-item>
                    <a-form-item label="SEO描述">
                        <a-textarea v-decorator="['seo_description']"></a-textarea>
                    </a-form-item>
                    <a-form-item label="内容">
                        <a-textarea v-decorator="['content']"></a-textarea>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="所属栏目">
                        <a-tree-select v-decorator="['column_id',{rules:[{required:true,message:'请选择所属栏目'}]}]"
                                       :tree-data="columnList"
                                       :loading="columnLoading"
                                       tree-default-expand-all></a-tree-select>
                    </a-form-item>
                    <a-form-item label="作者">
                        <a-input v-decorator="['author']"></a-input>
                    </a-form-item>
                    <a-form-item label="来源">
                        <a-input v-decorator="['source']"></a-input>
                    </a-form-item>
                    <a-form-item label="外部链接">
                        <a-input v-decorator="['url']"></a-input>
                    </a-form-item>
                    <a-form-item label="标签">
                        <a-select v-decorator="['tags']"
                                  mode="tags"></a-select>
                    </a-form-item>
                    <a-form-item label="属性">
                        <a-checkbox v-decorator="['is_recommend',{valuePropName:'checked'}]">推荐</a-checkbox>
                        <a-checkbox v-decorator="['is_hot',{valuePropName:'checked'}]">热点</a-checkbox>
                    </a-form-item>
                    <a-form-item label="状态">
                        <a-radio-group v-decorator="['status',{initialValue:'1'}]">
                            <a-radio value="1">正常</a-radio>
                            <a-radio value="0">禁用</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="排序">
                        <a-input-number v-decorator="['sort',{initialValue:'99'}]"></a-input-number>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {form} from '@/utils/mixin';
    import {changeKeys, stringToArray, arrayToString, stringToBoolean, booleanToString} from "@/utils/util";

    export default {
        mixins: [form],
        data() {
            return {
                columnList: [],
                columnLoading: false
            };
        },
        created() {

        },
        watch: {
            visible(val) {
                if (val && !this.columnList.length) {
                    this.getColumnList();
                }
            }
        },
        methods: {
            /**
             * 获取栏目列表
             */
            async getColumnList() {
                this.columnLoading = true;
                const {code, data: {list}} = await this.$api.information.column.getList();
                this.columnLoading = false;
                if (code == '0') {
                    this.columnList = changeKeys(list);
                }
            },
            /**
             * 新增
             */
            handleInsert() {
                this.toggleModal();
                this.title = '新增';
            },
            /**
             * 编辑
             */
            handleEdit(record) {
                this.toggleModal();
                this.record = record;
                this.title = '编辑';
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        title: record.title,
                        sub_title: record.sub_title,
                        seo_keywords: record.seo_keywords,
                        seo_description: record.seo_description,
                        content: record.content,
                        column_id: record.column_id,
                        author: record.author,
                        source: record.source,
                        url: record.url,
                        tags: stringToArray(record.tags),
                        is_recommend: stringToBoolean(record.is_recommend),
                        is_hot: stringToBoolean(record.is_hot),
                        status: record.status,
                        sort: record.sort
                    });
                });
            },
            /**
             * 删除
             * @param record
             */
            handleDelete(record) {
                this.$api.information.news.delete({
                    id: record.id
                }).then(({code}) => {
                    if (code == 0) {
                        this.$emit('delete', record);
                    }
                });
            },
            /**
             * 确认
             */
            onOk() {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        this.confirmLoading = true;
                        this.$api.information.news.submit({
                            id: this.record.id,
                            title: values.title,
                            sub_title: values.sub_title,
                            seo_keywords: values.seo_keywords,
                            seo_description: values.seo_description,
                            content: values.content,
                            column_id: values.column_id,
                            author: values.author,
                            source: values.source,
                            url: values.url,
                            tags: arrayToString(values.tags),
                            is_recommend: booleanToString(values.is_recommend),
                            is_hot: booleanToString(values.is_hot),
                            status: values.status,
                            sort: values.sort
                        }).then(({code}) => {
                            this.confirmLoading = false;
                            if (code == 0) {
                                this.reset();
                                this.toggleModal();
                                this.$emit('ok');
                            }
                        });
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
            }
        }
    };
</script>

<style scoped>

</style>