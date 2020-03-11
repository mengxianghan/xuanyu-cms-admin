const CompressionPlugin = require('compression-webpack-plugin')
const fs = require('fs')
const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
    externals: {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'ant-design-vue': 'antd',
        'moment': 'moment',
        'lodash': '_',
        'axios': 'axios',
        'js-md5': 'md5'
    },
    css: {
        common: [
            'https://cdn.jsdelivr.net/npm/ant-design-vue@1.4.12/dist/antd.min.css'
        ]
    },
    js: {
        production: [
            'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
            'https://cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
            'https://cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
            'https://cdn.jsdelivr.net/npm/moment@2.24.0/min/moment.min.js',
            'https://cdn.jsdelivr.net/npm/ant-design-vue@1.4.12/dist/antd.min.js',
            'https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js',
            'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-md5@0.7.3/src/md5.min.js'
        ]
    }
}

const getAssetsCDN = (obj) => {
    let arr = []
    if (obj.hasOwnProperty('common')) {
        obj.common.forEach(item => {
            arr.push(item)
        })
    }
    if (obj.hasOwnProperty(process.env.NODE_ENV)) {
        obj[process.env.NODE_ENV].forEach(item => {
            arr.push(item)
        })
    }
    return arr
}

const webpackPlugins = []

if (isProd) {
    webpackPlugins.push(new CompressionPlugin({
        filename: '[path].gz[query]',
        test: /\.(js|css)$/,
        threshold: 10240,
        deleteOriginalAssets: false,
    }))
}

module.exports = {
    assetsDir: 'static',
    outputDir: 'dist',
    lintOnSave: false,

    configureWebpack: {
        externals: isProd ? assetsCDN.externals : {},
        plugins: webpackPlugins
    },

    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'xuanyu CMS'
                args[0].cdn = {
                    css: [
                        ...getAssetsCDN(assetsCDN.css)
                    ],
                    js: [
                        ...getAssetsCDN(assetsCDN.js)
                    ]
                }
                return args
            })
    },

    css: {
        loaderOptions: {
            sass: {
                prependData: `@import '@/assets/style/vars.scss';`
            }
        }
    },

    devServer: {
        host: '0.0.0.0',
        port: 9999,
        watchOptions: {
            ignored: /node_modules|dist|.git|.idea/,
            poll: true
        }
    },
    productionSourceMap: false
}
