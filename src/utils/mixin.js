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
            formItemLayoutGoods: {
                labelCol: {
                    sm: 7,
                    lg: 7
                },
                wrapperCol: {
                    sm: 17,
                    lg: 10
                }
            },
            form: this.$form.createForm(this),
            confirmLoading: false
        }
    },
    methods: {
        /**
         * 切换对话框
         */
        toggleModal() {
            this.visible = !this.visible
        },
        /**
         * 重置
         */
        reset() {
            this.form.resetFields()
            this.record = {}
        },
        /**
         * 筛选输入项
         * @param input
         * @param option
         * @returns {boolean}
         */
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            )
        }
    }
}
