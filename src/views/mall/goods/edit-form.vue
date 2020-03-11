<template>
    <a-drawer :visible="visible"
              :title="title"
              wrap-class-name="goods-drawer-wrapper"
              width="80%"
              @close="onCancel">
        <div class="goods-drawer">
            <div class="goods-drawer__form">
                <a-form :form="form"
                        v-bind="formItemLayoutGoods">
                    <div class="goods-module-title">商品类型</div>
                    <a-form-item label="商品类型">
                        <a-radio-group v-decorator="['goods_type',{initialValue:'1'}]"
                                       class="goods-type-radio">
                            <a-radio-button value="1">
                                <div>实物商品</div>
                                <div class="text-secondary fs-12">(物流发货)</div>
                            </a-radio-button>
                            <a-radio-button value="2">
                                <div>虚拟商品</div>
                                <div class="text-secondary fs-12">(无需物流)</div>
                            </a-radio-button>
                        </a-radio-group>
                    </a-form-item>

                    <!--基本信息-->
                    <div class="goods-module-title">基本信息</div>
                    <a-form-item label="商品名">
                        <a-input v-decorator="['name',{rules:[{required:true,message:'请输入商品名称'}]}]"></a-input>
                    </a-form-item>
                    <a-form-item label="分享描述">
                        <a-input v-decorator="['share_description']"></a-input>
                    </a-form-item>
                    <a-form-item label="商品卖点">
                        <a-input v-decorator="['selling_point']"></a-input>
                    </a-form-item>
                    <a-form-item label="商品图"
                                 extra="建议尺寸：800*800px，单张大小不超过1M，最多可上传10张">
                        <x-uploader v-decorator="['picture',{rules:[{required:true,message:'请上传商品主图'}]}]"
                                    list-type="picture-card"
                                    show-upload-list
                                    multiple
                                    :count="10"></x-uploader>
                    </a-form-item>
                    <a-form-item label="展示分类">
                        <a-tree-select v-decorator="['classify_id']"
                                       tree-checkable
                                       allow-clear
                                       :tree-data="classifyList"></a-tree-select>
                    </a-form-item>
                    <a-form-item label="商品类目">
                        <a-tree-select v-decorator="['category_id']"
                                       :tree-data="categoryList"></a-tree-select>
                    </a-form-item>
                    <!--<a-form-item label="商品标签">
                        <x-dict-select v-decorator="['tag_key']"
                                       dict="goodsTag"
                                       show-search
                                       allow-clear
                                       mode="multiple"></x-dict-select>
                    </a-form-item>-->

                    <!--价格库存-->
                    <div class="goods-module-title">价格库存</div>
                    <a-form-item label="商品规格">
                    </a-form-item>
                    <a-form-item label="价格">
                        <a-input v-decorator="['price',{rules:[{required:true,message:'请填写价格'}]}]"
                                 addon-before="¥"
                                 addon-after="元"></a-input>
                    </a-form-item>
                    <a-form-item label="划线价"
                                 extra="商品没有优惠的情况下，划线价在商品详情会以划线形式显示">
                        <a-input v-decorator="['cross   ed_price']"
                                 addon-before="¥"
                                 addon-after="元"></a-input>
                    </a-form-item>
                    <a-form-item label="库存扣减方式">
                        <a-radio-group v-decorator="['inventory_deduction']">
                            <div>
                                <a-radio value="1">拍下减库存</a-radio>
                                <div class="ant-form-extra">买家提交订单，扣减库存数量，可能存在恶意占用库存风险</div>
                            </div>
                            <div>
                                <a-radio vlaue="2">付款减库存</a-radio>
                                <div class="ant-form-extra">买家支付成功，扣减库存数量，可能存在超卖风险</div>
                            </div>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="库存">
                        <a-input v-decorator="['inventory',{rules:[{required:true,message:'请填写库存'}]}]"></a-input>
                        <a-checkbox>商品详情不显示剩余件数</a-checkbox>
                    </a-form-item>
                    <a-form-item label="重量"
                                 extra="该重量用于运费模版中的计重收费和同城配送续重收费">
                        <a-input addon-after="KG"
                                 v-decorator="['weight']"></a-input>
                    </a-form-item>
                    <a-form-item label="会员折扣"
                                 extra="是否勾选不影响自定义会员价生效">
                        <a-checkbox v-decorator="['member_discount']">参与会员折扣</a-checkbox>
                    </a-form-item>
                    <a-form-item label="商品编码">
                        <a-input v-decorator="['goods_no']"></a-input>
                    </a-form-item>
                    <a-form-item label="成本价"
                                 extra="成本价未来会用于营销建议，利润分析等">
                        <a-input addon-before="¥"
                                 addon-after="元"
                                 v-decorator="['cost_price']"></a-input>
                    </a-form-item>

                    <!--物流信息-->
                    <div class="goods-module-title">物流信息</div>
                    <a-form-item label="配送方式">
                        <a-checkbox-group class="delivery_method">
                            <a-checkbox value="1">快递发货</a-checkbox>
                            <a-checkbox value="2">同城配送</a-checkbox>
                            <a-checkbox value="3">到店自提</a-checkbox>
                        </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="快递运费">
                        <a-radio-group v-decorator="['freight_type']">
                            <a-row>
                                <a-col :span="6">
                                    <a-radio value="1">统一运费</a-radio>
                                </a-col>
                                <a-col :span="12">
                                    <a-input addon-before="¥"
                                             addon-after="元"
                                             v-decorator="['freight']"></a-input>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="6">
                                    <a-radio value="2">运费模板</a-radio>
                                </a-col>
                                <a-col :span="12">

                                </a-col>
                                <a-col :span="24" class="ant-form-extra">运费模板支持按地区设置运费，按购买件数计算运费，按重量计算运费等</a-col>
                            </a-row>
                        </a-radio-group>
                    </a-form-item>

                    <!--其他信息-->
                    <div class="goods-module-title">其他信息</div>
                    <a-form-item label="上架时间">
                        <a-radio-group v-decorator="['is_shelves',{initialValue:'1'}]">
                            <a-row>
                                <a-col :span="24">
                                    <a-radio value="1">立即上架售卖</a-radio>
                                </a-col>
                                <a-col :span="8">
                                    <a-radio value="2">自定义上架时间</a-radio>
                                </a-col>
                                <a-col :span="16">
                                    <a-date-picker format="YYYY-MM-DD HH:mm:ss"
                                                   show-time
                                                   v-decorator="['shelves_time']"></a-date-picker>
                                </a-col>
                                <a-col :span="8">
                                    <a-radio value="3">暂不售卖，放入仓库</a-radio>
                                </a-col>
                            </a-row>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="立即购买按钮">
                        <a-radio-group v-decorator="['buy_button',{initialValue:'1'}]">
                            <a-row>
                                <a-col :span="12">
                                    <a-radio value="1">默认名称</a-radio>
                                </a-col>
                                <a-col class="ant-form-extra">默认为“立即购买”</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="12">
                                    <a-radio value="2">自定义名称</a-radio>
                                </a-col>
                                <a-col :span="12">
                                    <a-input placeholder="6个字以内" v-decorator="['buy_button_name']"></a-input>
                                </a-col>
                                <a-col class="ant-form-extra">如：“马上抢购”，设置仅对当前商品有效</a-col>
                            </a-row>
                        </a-radio-group>
                    </a-form-item>
                </a-form>
            </div>
            <div class="goods-drawer__footer">
                <a-button type="primary" @click="onOk">确定</a-button>
            </div>
        </div>
    </a-drawer>
</template>

<script>
    import {form} from '@/utils/mixin'
    import {changeKeys} from '@/utils/util'

    /*const columns = [
        {
            key: 'price',
            slots: {title: 'price'},
            scopedSlots: {customRender: 'price'}
        },
        {
            key: 'inventory',
            slots: {title: 'inventory'},
            scopedSlots: {customRender: 'inventory'}
        },
        {
            title: '重量(kg)',
            key: 'weight',
            scopedSlots: {customRender: 'weight'}
        },
        {
            title: '规格编码',
            key: 'specificationCoding',
            scopedSlots: {customRender: 'specificationCoding'}
        },
        {
            title: '成本价',
            key: 'cost',
            scopedSlots: {customRender: 'cost'}
        },
        {
            title: '销量',
            dataIndex: 'sales'
        }
    ]*/

    function descartes(data) {
        return data.reduce(function (a, b) {
            let res = []
            a.forEach(function (a) {
                b.forEach(function (b) {
                    res.push([...a, b])
                })
            })
            return res
        }, [[]])
    }

    export default {
        mixins: [form],
        data() {
            return {
                categoryList: [],
                classifyList: [],
            }
        },
        watch: {
            visible(value) {
                if (value) {
                    if (!this.categoryList.length) this.getCategoryList()
                    if (!this.classifyList.length) this.getClassifyList()
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
             * 确认
             */
            onOk() {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        return
                        this.confirmLoading = true
                        this.$api.system.post.submit({
                            id: this.record.id,
                            ...values
                        }).then(({code}) => {
                            this.confirmLoading = false
                            if (code === '200') {
                                this.reset()
                                this.toggleModal()
                                this.$emit('ok', values)
                                this.$emit('complete', values)
                            }
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
    .goods {
        &-drawer {
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

        &-module-title {
            font-size: 16px;
            line-height: 24px;
            padding: 12px 0;
            display: flex;
            align-items: center;

            &::before {
                content: '';
                width: 4px;
                height: 16px;
                display: inline-block;
                background: $color-primary;
                margin-right: 8px;
            }
        }

        &-type-radio {
            /deep/ {
                .ant-radio-button-wrapper {
                    height: auto;
                    line-height: 20px;
                    padding-top: 4px;
                    padding-bottom: 4px;
                    text-align: center;
                }
            }
        }

        &-standard-table {
            /deep/ {
                .ant-form-item {
                    margin-bottom: 0;
                }

                .ant-form-item-control {
                    line-height: 1;
                }
            }
        }
    }
</style>
