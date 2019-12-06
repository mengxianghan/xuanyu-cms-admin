<template>
    <a-upload list-type="picture-card"
              multiple
              :custom-request="customRequest"
              :file-list="fileList">
        <a-icon type="plus" style="font-size:24px;"></a-icon>
        <p>选择图片</p>
    </a-upload>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "XUpload",
        props: {
            value: ''
        },
        data() {
            return {
                fileList: []
            };
        },
        computed: {
            ...mapState({
                domainName: state => state.config.domainName,
                uploadDir: state => state.config.uploadDir,
                allowedFileType: state => state.config.allowedFileType,
                allowedFileSize: state => state.config.allowedFileSize,
            }),
        },
        watch: {
            fileList: {
                deep: true,
                handler(val) {
                    const id = val.map(item => item.uid).join(',');
                    // v-model
                    this.$emit('input', id);
                    // v-decorator
                    this.$emit('change', id);
                }
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            /**
             * 获取文件列表
             */
            async getList() {
                const {code, data: {list}} = await this.$api.system.upload.getList({
                    id: this.value,
                    has_pagination: '0'
                });
                if (code === '0') {
                    const fileList = list.map(item => (this.generatorFileItem(item)));
                    this.fileList = fileList;
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
                        this.fileList.push(this.generatorFileItem(data));
                        options.onSuccess(data);
                    } else {
                        options.onError();
                    }
                }, err => {
                    options.onError();
                }).catch(err => {
                    options.onError();
                });
            },
            generatorFileItem(record) {
                return {
                    uid: record.id,
                    name: record.orig_name,
                    status: 'done',
                    url: `${this.domainName}${record.relative_path}`
                };
            }
        }
    };
</script>

<style scoped>

</style>