<template>
    <a-card :bordered="false"
            :tabList="tabList"
            :activeTabKey="key"
            @tabChange="onTabChange">
        <a-form :form="form"
                v-bind="{labelCol:{span:7},wrapperCol:{xs:24,sm:12,md:10}}">
            <!--基本配置-->
            <div v-show="key == 'basic'">
                <a-form-item label="名称">
                    <a-input v-decorator="['name']"></a-input>
                </a-form-item>
                <a-form-item label="域名">
                    <a-input v-decorator="['domain_name']"></a-input>
                </a-form-item>
                <a-form-item label="版权">
                    <a-input v-decorator="['copyright']"
                             placeholder="版权、备案号等"></a-input>
                </a-form-item>
                <a-form-item label="状态">
                    <a-radio-group v-decorator="['status']">
                        <a-radio value="1">正常运行</a-radio>
                        <a-radio value="0">关闭站点</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="关闭说明">
                    <a-textarea v-decorator="['close_explain']"
                                :rows="4"
                                placeholder="关闭站点后，访问网站时的提示信息"></a-textarea>
                </a-form-item>
            </div>
            <!--SEO配置-->
            <div v-show="key == 'seo'">
                <a-form-item label="标题">
                    <a-input v-decorator="['title']"
                             placeholder="一般不超过80个字符"></a-input>
                </a-form-item>
                <a-form-item label="关键字">
                    <a-textarea v-decorator="['keywords']"
                                placeholder="一般不超过100个字符"></a-textarea>
                </a-form-item>
                <a-form-item label="描述">
                    <a-textarea v-decorator="['description']"
                                :rows="4"
                                placeholder="一般不超过200个字符"></a-textarea>
                </a-form-item>
                <a-form-item label="代码">
                    <a-textarea v-decorator="['script']"
                                :rows="8"
                                placeholder="统计代码、百度商桥、58客服等"></a-textarea>
                </a-form-item>
            </div>
            <!--上传配置-->
            <div v-show="key == 'upload'">
                <a-form-item label="上传目录">
                    <a-input v-decorator="['upload_dir']"></a-input>
                </a-form-item>
                <a-form-item label="允许的文件类型"
                             extra="* 代表所有文件；也可以使用 jpg|png|gif 方式">
                    <a-input
                            v-decorator="['allowed_file_type']"></a-input>
                </a-form-item>
                <a-form-item label="允许的文件大小"
                             extra="1 MB = 1024 KB">
                    <a-input v-decorator="['allowed_file_size']"
                             addonAfter="MB"></a-input>
                </a-form-item>
            </div>
            <a-form-item v-bind="{wrapperCol:{offset:7,xs:24,sm:12,md:10}}">
                <a-button type="primary"
                          :loading="loading"
                          @click="handleSubmit"
                          v-action:save>保存
                </a-button>
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script>
    import {form} from '@/utils/mixin';

    const tabList = [
        {
            tab: '基本配置',
            key: 'basic',
        },
        {
            tab: 'SEO配置',
            key: 'seo',
        },
        {
            tab: '上传配置',
            key: 'upload',
        },
    ];
    export default {
        name: "index",
        mixins: [form],
        data() {
            return {
                tabList,
                key: 'basic',
                id: '',
                loading: false
            };
        },
        created() {
            const {tab} = this.$route.query;
            if (tab) this.key = tab;
            this.getData();
        },
        watch: {
            '$route'(val) {
                if (val.query.tab) this.key = val.query.tab;
            }
        },
        methods: {
            /**
             * 获取数据
             */
            getData() {
                this.$api.system.config.getData().then(({code, data}) => {
                    if (code === '0') {
                        this.form.setFieldsValue({
                            name: data.name,
                            domain_name: data.domain_name,
                            copyright: data.copyright,
                            status: data.status || '1',
                            close_explain: data.close_explain,
                            title: data.title,
                            keywords: data.keywords,
                            description: data.description,
                            script: data.script,
                            upload_dir: data.upload_dir,
                            allowed_file_type: data.allowed_file_type,
                            allowed_file_size: data.allowed_file_size
                        });
                        this.id = data.id;
                    }
                });
            },
            /**
             * 提交
             */
            handleSubmit() {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        this.loading = true;
                        this.$api.system.config.submit({
                            id: this.id,
                            name: values.name,
                            domain_name: values.domain_name,
                            copyright: values.copyright,
                            status: values.status,
                            close_explain: values.close_explain,
                            title: values.title,
                            keywords: values.keywords,
                            description: values.description,
                            script: values.script,
                            upload_dir: values.upload_dir,
                            allowed_file_type: values.allowed_file_type,
                            allowed_file_size: values.allowed_file_size
                        }).then(({code, data}) => {
                            this.loading = false;
                            if (code === '0') {
                                if (data.insert_id) {
                                    this.id = data.insert_id;
                                }
                                this.$store.dispatch('config/setConfig', values);
                            }
                        });
                    }
                });
            },
            /**
             * 切换页签
             * @param key
             */
            onTabChange(key) {
                this.$router.push({name: 'config', query: {tab: key}});
            }
        }
    };
</script>

<style scoped>

</style>