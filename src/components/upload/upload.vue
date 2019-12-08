<template>
    <a-upload :list-type="listType"
              multiple
              :custom-request="customRequest"
              :show-upload-list="showUploadList"
              :file-list="fileList"
              @change="handleChange">
        <slot :file-list="fileList" :loading="loading">
            <template v-if="multiple">
                <a-icon type="plus"></a-icon>
                <p>选择图片</p>
            </template>
            <template v-else>
                <img v-if="fileList.length" :src="fileList[0].url"/>
                <div v-else>
                    <template v-if="!loading">
                        <a-icon type="plus"/>
                        <div class="ant-upload-text">选择图片</div>
                    </template>
                    <template v-else>
                        <a-icon type="loading"/>
                        <div class="ant-upload-text">正在上传</div>
                    </template>
                </div>
            </template>
        </slot>
    </a-upload>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "XUpload",
        props: {
            value: '',
            field: {
                type: String,
                default: 'web_path'
            },
            showUploadList: {
                type: Boolean,
                default: false
            },
            multiple: {
                type: Boolean,
                default: false
            },
            listType: {
                type: String,
                default: 'text'
            }
        },
        data() {
            return {
                backfillList: [],
                loading: false
            };
        },
        computed: {
            ...mapState({
                domainName: state => state.config.domainName,
                uploadDir: state => state.config.uploadDir,
                allowedFileType: state => state.config.allowedFileType,
                allowedFileSize: state => state.config.allowedFileSize,
            }),
            fileList() {
                const fileList = this.backfillList.map(item => ({
                    uid: item.id,
                    name: item.orig_name,
                    status: 'done',
                    url: item.web_path
                }));
                return fileList;
            },
        },
        watch: {
            value(val) {
                this.getBackFillList();
            },
            backfillList: {
                deep: true,
                handler(val) {
                    const value = val.map(item => item[this.field] || '').join(',');
                    // v-model
                    this.$emit('input', value);
                    // v-decorator
                    this.$emit('change', value);
                }
            }
        },
        methods: {
            /**
             * 获取回填列表
             */
            async getBackFillList() {
                if (!this.value) {
                    this.backfillList = [];
                    return;
                }
                const params = {};
                params['field'] = this.field;
                params[this.field] = this.value;
                const {code, data: {list}} = await this.$api.system.upload.getBackfillList(params);
                if (code === '0') {
                    this.backfillList = list;
                }
            },
            /**
             * 上传文件改变
             */
            handleChange(info) {
                console.log(info);
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    this.loading = false;
                }
            },
            /**
             * 自定义上传
             * @param options
             */
            customRequest(options) {
                const formData = new FormData();
                //文件对象
                formData.append('file', options.file);
                formData.append('domain_name', this.domainName);
                formData.append('upload_dir', this.uploadDir);
                formData.append('allowed_file_type', this.allowedFileType);
                formData.append('allowed_file_size', this.allowedFileSize);
                //文件目录
                this.$api.system.upload.doUpload(formData, {
                    onUploadProgress: function (progressEvent) {
                        const percent = progressEvent.loaded / progressEvent.total * 100;
                        options.onProgress({
                            percent: percent
                        });
                    }
                }).then(({code, message, data}) => {
                    if (code === '0') {
                        if (this.multiple) {
                            this.backfillList.push(data);
                        } else {
                            this.backfillList = [data];
                        }
                        options.onSuccess(data);
                    } else {
                        options.onError();
                    }
                }, err => {
                    options.onError();
                }).catch(err => {
                    options.onError();
                });
            }
        }
    };
</script>

<style scoped>

</style>