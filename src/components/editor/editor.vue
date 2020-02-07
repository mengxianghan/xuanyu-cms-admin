<template>
    <div>
        <editor v-model="content"
                :init="init"
                :disabled="disabled">
        </editor>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import tinymce from 'tinymce'
    import Editor from '@tinymce/tinymce-vue'
    // import 'tinymce/themes/silver';
    // 编辑器插件plugins
    // 更多插件参考：https://www.tiny.cloud/docs/plugins/
    // import 'tinymce/plugins/image';// 插入上传图片插件
    // import 'tinymce/plugins/media';// 插入视频插件
    // import 'tinymce/plugins/table';// 插入表格插件
    // import 'tinymce/plugins/lists';// 列表插件
    // import 'tinymce/plugins/wordcount';// 字数统计插件
    // import 'tinymce/plugins/quickbars';

    export default {
        name: "XEditor",
        components: {
            'editor': Editor
        },
        props: {
            value: '',
            menubar: {
                type: [String, Boolean],
                default: true
            },
            plugins: {
                type: String,
                default: 'image media table lists wordcount'
            },
            toolbar: {
                type: [String, Boolean],
                default: 'undo redo | formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            height: {
                type: Number,
                default: 480
            },
            prependUrl: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                content: ''
            }
        },
        computed: {
            ...mapState({
                domainName: state => this.prependUrl || state.config.domainName,
                uploadDir: state => state.config.uploadDir,
                allowedFileType: state => state.config.allowedFileType,
                allowedFileSize: state => state.config.allowedFileSize,
            }),
            init() {
                return {
                    branding: false,
                    content_css: '/static/skins/content/default/content.css',
                    language_url: '/static/tinymce/langs/zh_CN.js',  //public目录下
                    language: 'zh_CN',
                    skin_url: '/static/tinymce/skins/ui/custom', //public目录下
                    min_height: 300,
                    height: this.height,
                    menubar: this.menubar,
                    plugins: this.plugins,  // 父组件传入 或者 填写个默认的插件 要选用什么插件都可以 去官网可以查到
                    toolbar: this.toolbar,  // 工具栏
                    draggable_modal: true, // 对话框拖动
                    elementpath: false, // 元素路径
                    images_upload_url: '', //上传路径
                    image_prepend_url: this.domainName,
                    // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
                    // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
                    images_upload_handler: (blobInfo, success, failure) => {
                        const formData = new FormData()
                        //文件对象
                        formData.append('file', blobInfo.blob(), blobInfo.filename())
                        formData.append('upload_dir', this.uploadDir)
                        formData.append('allowed_file_type', this.allowedFileType)
                        formData.append('allowed_file_size', this.allowedFileSize)
                        //文件目录
                        this.$api.system.upload.doUpload(formData).then(({code, message, data}) => {
                            if (code === '200') {
                                success(data.relative_path)
                            } else {
                                failure(message)
                            }
                        })
                    }
                }
            }
        },
        mounted() {
            tinymce.init({})
        },
        watch: {
            value(val) {
                this.content = val
            },
            content(val) {
                // v-model
                this.$emit('input', val)
                // v-decorator
                this.$emit('change', val)
            },
        },
        methods: {}
    }
</script>

<style scoped>

</style>
