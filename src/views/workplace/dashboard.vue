<template>
    <div>
        <a-card :bordered="false"
                class="user-info">
            <div class="user-info-main">
                <a-avatar :size="72"
                          :src="logo"
                          class="user-info__avatar"></a-avatar>
                <div class="user-info__content">
                    <div class="user-info__title">
                        {{timeFix}}，{{fullName}}
                    </div>
                    <div class="user-info__desc">
                        上次登录时间：{{lastLoginTime}}
                    </div>
                </div>
            </div>
        </a-card>
        <a-row :gutter="24">
            <a-col :xs="24" :md="16">
                <a-card title="系统信息"
                        :bordered="false">
                    <a-list :bordered="false"
                            class="list">
                        <a-list-item>域名：{{config.domainName}}</a-list-item>
                        <a-list-item>上传目录：{{config.uploadDir}}</a-list-item>
                        <a-list-item>允许上传文件类型：{{config.allowedFileType}}</a-list-item>
                        <a-list-item>允许上传文件大小：{{config.allowedFileSize}}</a-list-item>
                    </a-list>
                </a-card>
            </a-col>
            <a-col :xs="24" :md="8">
                <a-card title="开发人员"
                        :bordered="false">
                    <a-list :bordered="false"
                            class="list">
                        <a-list-item>官网：<a href="http://www.xuanyunet.com/" target="_blank">http://www.xuanyunet.com</a>
                        </a-list-item>
                        <a-list-item>程序开发：mengxianghan</a-list-item>
                        <a-list-item>交互设计：
                            <div class="user-group">
                                <a-avatar :size="18"
                                          shape="square"
                                          :src="antd">
                                </a-avatar>
                                <a-avatar :size="18"
                                          shape="square"
                                          :src="logo"></a-avatar>
                            </div>
                        </a-list-item>
                        <a-list-item>讨论区：<a target="_blank"
                                            href="http://shang.qq.com/wpa/qunwpa?idkey=0d129222878ba69e9aae2ddd6d84f0800e985f83bfd19467ebb73e92c76badf9"
                                            title="轩宇网络"><i class="fa fa-qq"></i>&nbsp;QQ群</a></a-list-item>
                    </a-list>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import {timeFix} from '@/utils/util'
    import antd from '@/assets/images/ant-design-vue.svg'
    import {mapState, mapActions} from 'vuex'

    export default {
        data() {
            return {
                antd,
                timeFix: timeFix()
            }
        },
        created() {
        },
        computed: {
            ...mapState({
                logo: state => state.app.logo,
                fullName: state => state.user.fullName,
                lastLoginTime: state => state.user.lastLoginTime || '首次登录',
                config: state => state.config || {}
            })
        },
        methods: {
            ...mapActions({
                setConfig: 'config/setConfig'
            })
        }
    }
</script>

<style lang="scss" scoped>
    .user-info {
        margin: -24px -24px 24px;

        &-main {
            display: flex;
            align-items: center;
        }

        &__avatar {
            margin-right: 24px;
        }

        &__title {
            flex: 1;
            font-size: 20px;
            line-height: 28px;
            font-weight: 500;
            color: rgba(0, 0, 0, .85);
            margin-bottom: 16px;
        }

        &__desc {
            color: rgba(0, 0, 0, .45);
        }
    }

    .list {
        /deep/ {
            .ant-list-item {
                border-bottom: 0;
            }
        }
    }
</style>
