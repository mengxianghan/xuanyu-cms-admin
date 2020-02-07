<template>
    <a-drawer :visible="visible"
              :title="title"
              wrap-class-name="goods-drawer-wrapper"
              width="80%"
              @close="onCancel">
        <div class="goods-drawer">
            <div class="goods-drawer__form">
                <a-steps :current="current" style="margin-bottom:24px;">
                    <a-step title="基本信息"></a-step>
                    <a-step title="规格信息"></a-step>
                    <a-step title="图文详情"/>
                    <a-step title="其他信息"/>
                </a-steps>
                <a-form :form="form"
                        v-bind="formItemLayoutGoods">
                    <a-form-item label="SPU编码">
                        <a-input v-decorator="['spu']"></a-input>
                    </a-form-item>
                    <!--<a-form-item label="商品类型">
                        <a-input v-decorator="['category_id']"></a-input>
                    </a-form-item>-->
                    <a-form-item label="商品名称">
                        <a-input v-decorator="['name',{rules:[{required:true,message:'请输入商品名称'}]}]"></a-input>
                    </a-form-item>
                    <a-form-item label="商品分类">
                        <a-tree-select v-decorator="['category_id']"
                                       :tree-data="categoryList"></a-tree-select>
                    </a-form-item>
                    <a-form-item label="展示分类">
                        <a-row>
                            <a-col :span="12">
                                <a-tree-select v-decorator="['classify_id',{rules:[{required:true,message:'请选择展示分类'}]}]"
                                               tree-checkable
                                               :tree-data="classifyList"></a-tree-select>
                            </a-col>
                            <!--<a-col :span="3">
                                <a-button icon="plus" type="link">新增分类</a-button>
                            </a-col>-->
                        </a-row>
                    </a-form-item>
                    <a-form-item label="商品品牌">
                        <a-row>
                            <a-col :span="12">
                                <a-select v-decorator="['brand_id']">
                                    <a-select-option v-for="item in brandList" :key="item.id">{{item.name}}
                                    </a-select-option>
                                </a-select>
                            </a-col>
                            <!--<a-col :span="3">
                                <a-button icon="plus" type="link">新增品牌</a-button>
                            </a-col>-->
                        </a-row>
                    </a-form-item>
                    <a-form-item label="计量单位">
                        <a-row>
                            <a-col :span="12">
                                <x-dict-select v-decorator="['measure_unit_key']"
                                               dict="measureUnit"
                                               allow-clear
                                               show-search></x-dict-select>
                            </a-col>
                        </a-row>
                    </a-form-item>
                    <a-form-item label="商品标签">
                        <x-dict-select v-decorator="['tag_key']"
                                       dict="goodsTag"
                                       show-search
                                       mode="multiple"></x-dict-select>
                    </a-form-item>
                    <a-form-item label="商品主图"
                                 extra="建议尺寸：800*800px，单张大小不超过1M，最多可上传10张">
                        <x-uploader v-decorator="['picture',{rules:[{required:true,message:'请上传商品主图'}]}]"
                                    list-type="picture-card"
                                    show-upload-list
                                    multiple
                                    :count="10"></x-uploader>
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
                </a-form>
            </div>
            <div class="goods-drawer__footer">
                <a-button type="default" @click="handlePrev" v-if="current > 0">上一步</a-button>
                <a-button type="primary" @click="handleNext" v-if="current < 3">下一步</a-button>
                <a-button type="primary" @click="onOk" v-if="current === 3">确定</a-button>
            </div>
        </div>
    </a-drawer>
</template>

<script>
    import {form} from '@/utils/mixin'
    import {changeKeys} from '@/utils/util'

    export default {
        mixins: [form],
        data() {
            return {
                current: 0,
                categoryList: [],
                classifyList: [],
                brandList: []
            }
        },
        created() {

        },
        watch: {
            visible(value) {
                if (value) {
                    if (!this.categoryList.length) this.getCategoryList()
                    if (!this.classifyList.length) this.getClassifyList()
                    if (!this.brandList.length) this.getBrandList()
                }
            }
        },
        methods: {
            /**
             * 获取商品分类
             */
            async getCategoryList() {
                const {code, data: {list}} = await this.$api.mall.category.getList({
                    status: '1',
                    has_pagination: '0'
                })
                if (code === '200') {
                    this.categoryList = changeKeys(list, {
                        title: "name",
                        value: "id",
                        key: "id",
                        children: "children"
                    })
                }
            },
            /**
             * 获取展示分类列表
             */
            async getClassifyList() {
                const {code, data: {list}} = await this.$api.mall.classify.getList({
                    status: '1',
                    has_pagination: '0'
                })
                if (code === '200') {
                    this.classifyList = changeKeys(list, {
                        title: "name",
                        value: "id",
                        key: "id",
                        children: "children"
                    })
                }
            },
            /**
             * 获取商品品牌列表
             */
            async getBrandList() {
                const {code, data: {list}} = await this.$api.mall.brand.getList({
                    status: '1',
                    has_pagination: '0'
                })
                if (code === '200') {
                    this.brandList = list
                }
            },
            /**
             * 新增
             */
            handleInsert() {
                this.toggleModal()
                this.title = '新增商品'
            },
            /**
             * 编辑
             */
            handleEdit(record) {
                this.toggleModal()
                this.record = record
                this.title = '编辑商品'
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        name: record.name,
                        status: record.status,
                        sort: record.sort
                    })
                })
            },
            /**
             * 删除
             * @param record
             */
            handleDelete(record) {
                this.$api.system.post.delete({
                    id: record.id
                }).then(({code}) => {
                    if (code === '200') {
                        this.$emit('delete', record)
                        this.$emit('complete', record)
                    }
                })
            },
            /**
             * 上一步
             */
            handlePrev() {
                this.current -= 1
            },
            /**
             * 下一步
             */
            handleNext() {
                this.current += 1
            },
            /**
             * 确认
             */
            onOk() {
                return
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        this.confirmLoading = true
                        this.$api.system.post.submit({
                            id: this.record.id,
                            spu: values.spu,
                            name: values.name,
                            category_id: values.category_id,
                            classify_id: values.classify_id,
                            brand_id: values.brand_id,
                            measure_unit_key: values.measure_unit_key,
                            tag_key: values.tag_key,
                            picture: values.picture,
                            status: values.status,
                            sort: values.sort
                        }).then(({code}) => {
                            this.confirmLoading = false
                            // if (code === '200') {
                            //     this.reset();
                            //     this.toggleModal();
                            //     this.$emit('ok', values);
                            //     this.$emit('complete', values);
                            // }
                        }, err => {
                            this.confirmLoading = false
                        })
                    }
                })
            },
            /**
             * 取消
             */
            onCancel() {
                this.reset()
                this.toggleModal()
                this.$emit('cancel')
            }
        }
    }
</script>

<style lang="scss">
    .goods-drawer-wrapper {
        .ant-drawer-body {
            position: absolute;
            width: 100%;
            left: 0;
            top: 55px;
            bottom: 0;
            overflow: hidden;
        }
    }
</style>
<style lang="scss" scoped>
    .goods-drawer {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;

        &__form {
            flex: 1;
            overflow: auto;
            padding: 24px;
        }

        &__footer {
            padding: 10px 16px;
            text-align: right;
            border-top: 1px solid #e8e8e8;
        }
    }
</style>
