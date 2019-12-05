<template>
    <div>
        <a-row :gutter="16">
            <a-col :md="5" :xs="24">
                <a-card :bordered="false">
                    <x-infor-column ref="informationColumn"
                                    @select="handleSelect"
                                    @complete="onComplete"
                                    :selected-keys="[currentColumn.id]"></x-infor-column>
                </a-card>
            </a-col>
            <a-col :md="19" :xs="24">
                <a-card :bordered="false">
                    <a-spin :spinning="spinning">
                        <a-form v-bind="formItemLayout"
                                :form="form">
                            <a-form-item label="标题">
                                <a-input v-decorator="['title',{rules:[{required:true,message:'请输入标题'}]}]"></a-input>
                            </a-form-item>
                            <a-form-item label="内容">
                                <x-editor v-decorator="['content']"></x-editor>
                            </a-form-item>
                            <a-form-item v-bind="formItemLayoutButton">
                                <a-button type="primary"
                                          :loading="confirmLoading"
                                          @click="handleSubmit"
                                          v-action:save>保存
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </a-spin>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import {form} from '@/utils/mixin';

    export default {
        mixins: [form],
        data() {
            return {
                confirmLoading: false,
                spinning: true,
                currentColumn: {
                    id: '',
                    name: ''
                },
                content: ''
            };
        },
        created() {
        },
        watch: {
            currentColumn: {
                deep: true,
                handler() {
                    this.getData();
                }
            },
        },
        methods: {
            /**
             * 获取数据
             */
            getData() {
                this.spinning = true;
                this.$api.information.single.getData({
                    column_id: this.currentColumn.id
                }).then(({code, data: {title, content}}) => {
                    this.spinning = false;
                    if (code === '0') {
                        this.form.setFieldsValue({
                            title: title || this.currentColumn.name,
                            content: content
                        });
                        this.content = content;
                    }
                });
            },
            /**
             * 保存
             */
            handleSubmit() {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        this.confirmLoading = true;
                        this.$api.information.single.submit({
                            column_id: this.currentColumn.id,
                            title: values.title,
                            content: values.content
                        }).then(({code, data}) => {
                            this.confirmLoading = false;
                        }, err => {
                            this.confirmLoading = false;
                        });
                    }
                });
            },
            /**
             * 选择栏目
             * @param selectedKeys
             */
            handleSelect(selectedKeys, e) {
                if (selectedKeys.length) {
                    const {title, value} = e.node;
                    this.$set(this.currentColumn, 'id', value);
                    this.$set(this.currentColumn, 'name', title);
                }
            },
            /**
             * 栏目加载完成
             * @param treeData
             */
            onComplete({treeData}) {
                const currentColumn = this.$refs.informationColumn.getFirstValidColumn(treeData);
                if (currentColumn) {
                    this.$set(this.currentColumn, 'id', currentColumn.value);
                    this.$set(this.currentColumn, 'name', currentColumn.title);
                }
            }
        }
    };
</script>

<style scoped>

</style>