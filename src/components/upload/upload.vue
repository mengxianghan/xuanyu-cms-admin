<template>
    <div>
        <a-upload :list-type="listType"
                  multiple
                  :custom-request="customRequest"
                  :show-upload-list="showUploadList"
                  :file-list="fileList"
                  :remove="handleRemove"
                  :before-upload="onBeforeUpload"
                  @change="handleChange"
                  @preview="handlePreview">
            <template v-if="fileList.length < count">
                <slot :file-list="fileList" :loading="loading">
                    <a-icon type="plus"></a-icon>
                    <p>选择图片</p>
                </slot>
            </template>
        </a-upload>
        <a-modal :visible="previewImageVisible" :footer="null" @cancel="previewImageVisible = false">
            <img style="width: 100%" :src="previewImageUrl"/>
        </a-modal>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "XUpload",
        props: {
            value: '',
            field: {
                type: String,
                default: 'id'
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
            },
            count: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                load: true,
                backfillList: [],
                loading: false,
                previewImageUrl: '',
                previewImageVisible: false
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
                    this.load = false;
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
                if (!this.load) return;
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
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    this.loading = false;
                }
            },
            /**
             * 预览
             */
            handlePreview(file) {
                this.previewImageUrl = file.url;
                this.previewImageVisible = true;
            },
            /**
             * 移除
             */
            handleRemove(file) {
                if (file) {
                    const id = file.uid;
                    const list = this.backfillList.filter(item => item.id !== id);
                    this.backfillList = list;
                }
            },
            /**
             * 上传文件前
             */
            onBeforeUpload(file, fileList) {
                if (fileList.length > this.count) {
                    this.$message.warning(`超出允许上传的数量 ${this.count}`);
                    return false;
                }
                return true;
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