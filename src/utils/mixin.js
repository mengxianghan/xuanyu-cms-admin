export const form = {
    data() {
        return {
            visible: false,
            title: '',
            record: {},
            formItemLayout: {
                labelCol: {
                    span: 5
                },
                wrapperCol: {
                    span: 16
                }
            },
            formItemLayoutButton: {
                wrapperCol: {
                    span: 16,
                    offset: 5
                }
            },
            form: this.$form.createForm(this),
            confirmLoading: false
        };
    },
    methods: {
        /**
         * 切换对话框
         */
        toggleModal() {
            this.visible = !this.visible;
        },
        /**
         * 重置
         */
        reset() {
            this.form.resetFields();
            this.record = {};
        }
    }
};