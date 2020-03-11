<template>
    <div>
        <a-form>
            <a-form-item label="标题1"
                         validate-status=""
                         help="">
                <a-input v-model="formData.title"></a-input>
            </a-form-item>
            <a-form-item>
                <a-button type="primary">提交表单</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    const rules = {
        title: {
            required: true,
            message: '请输入标题1'
        }
    }
    export default {
        data() {
            return {
                formData: {}
            }
        },
        beforeCreate() {
        },

    }
</script>
<style lang="scss" scoped>

</style>
