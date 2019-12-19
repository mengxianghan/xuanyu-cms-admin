<template>
    <a-modal v-model="visible"
             :title="title"
             :confirm-loading="confirmLoading"
             width="90%"
             :destory-on-close="true"
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
                        <x-editor v-decorator="['content']"></x-editor>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="所属栏目">
                        <a-tree-select v-decorator="['column_id',{rules:[{required:true,message:'请选择所属栏目'}]}]"
                                       :tree-data="columnTreeData"
                                       :loading="columnLoading"
                                       tree-default-expand-all></a-tree-select>
                    </a-form-item>
                    <a-form-item label="缩略图">
                        <x-upload v-decorator="['thumb']"
                                  list-type="picture-card"
                                  show-upload-list
                                  v-if="visible">
                        </x-upload>
                    </a-form-item>
                    <a-form-item label="作者">
                        <a-input v-decorator="['author']"></a-input>
                    </a-form-item>
                    <a-form-item label="来源">
                        <a-input v-decorator="['source']"></a-input>
                    </a-form-item>
                    <a-form-item label="外部链接">
                        <a-input v-decorator="['external_links']"></a-input>
                    </a-form-item>
                    <a-form-item label="标签">
                        <a-select v-decorator="['tag']"
                                  mode="tags"
                                  :not-found-content="tagSpinning ? undefined : null"
                                  @search="onTagSearch"
                                  @change="onTagChange">
                            <a-spin v-if="tagSpinning" slot="notFoundContent" size="small"/>
                            <a-select-option v-for="item in tagList" :key="item.value">{{item.text}}</a-select-option>
                        </a-select>
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
    import {debounce} from 'lodash';

    export default {
        mixins: [form],
        data() {
            this.onTagSearch = debounce(this.onTagSearch, 500);
            return {
                columnLoading: false,
                tagList: [],
                tagSpinning: false
            };
        },
        computed: {
            columnTreeData() {
                return this.$parent.columnTreeData;
            }
        },
        methods: {
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
                        thumb: record.thumb,
                        external_links: record.external_links,
                        tag: stringToArray(record.tag),
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
                    if (code === '200') {
                        this.$emit('delete', record);
                        this.$emit('complete', record);
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
                        const tag = arrayToString(values.tag);
                        this.submitTag(tag);
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
                            thumb: values.thumb,
                            external_links: values.external_links,
                            tag: tag,
                            is_recommend: booleanToString(values.is_recommend),
                            is_hot: booleanToString(values.is_hot),
                            status: values.status,
                            sort: values.sort
                        }).then(({code}) => {
                            this.confirmLoading = false;
                            if (code === '200') {
                                this.reset();
                                this.toggleModal();
                                this.$emit('ok', values);
                                this.$emit('complete', values);
                            }
                        }, error => {
                            this.confirmLoading = false;
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
            },
            /**
             * 搜索标签
             * @param value
             */
            onTagSearch(value) {
                if (!value) return;
                this.tagSpinning = true;
                this.$api.information.tag.getList({
                    name: value,
                    has_pagination: '0'
                }).then(({code, data: {list}}) => {
                    this.tagSpinning = false;
                    if (code === '200') {
                        const tagList = list.map(item => ({
                            text: item.name,
                            value: item.name
                        }));
                        this.tagList = tagList;
                    }
                }, error => {
                    this.tagSpinning = false;
                });
            },
            /**
             * 标签发生改变
             */
            onTagChange() {
                this.tagList = [];
            },
            /**
             * 提交 tag
             * @param name
             * @returns {Promise<void>}
             */
            async submitTag(name) {
                if (!name) return;
                await this.$api.information.tag.replace({
                    name: name
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>