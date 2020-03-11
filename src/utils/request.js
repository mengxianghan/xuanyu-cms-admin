import Vue from 'vue'
import router from '@/router'
import axios from 'axios'
import qs from 'qs'
import {message} from 'ant-design-vue'

const server = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 10000,
    withCredentials: false,
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    }
})

//请求拦截器
server.interceptors.request.use(req => {
    const userInfo = Vue.ls.get('userInfo')
    const token = userInfo instanceof Object ? userInfo.token : ''
    const menu = router.currentRoute.meta.id || ''
    if (token) {
        req.headers = {
            ...req.headers,
            token: token,
            menu: menu
        }
    }
    return req
}, err => {
    return Promise.reject(err)
})

//响应拦截器
server.interceptors.response.use(res => {
    if (res.data.message) {
        if (res.data.message) {
            if (res.data.code === '200') {
                message.success(`${res.data.message}`)
            } else {
                message.warning(`${res.data.message}，code：${res.data.code}`)
            }
        }
    }
    return res
}, err => {
    message.error(`err：${err.message}`)
    return Promise.reject(err)
})

const request = {
    /**
     * Post
     * @param url
     * @param data
     * @returns {Promise<unknown>}
     */
    post(url, data) {
        return new Promise((resolve, reject) => {
            server({
                method: 'post',
                url: url,
                data: qs.stringify(data)
            }).then(res => {
                resolve(res.data)
            }, err => {
                reject(err)
            }).catch(err => {
                reject(err)
            })
        })
    },
    /**
     * Get
     * @param url
     * @param params
     * @returns {Promise<unknown>}
     */
    get(url, params) {
        return new Promise((resolve, reject) => {
            server({
                method: 'get',
                url: url,
                params: params
            }).then(res => {
                resolve(res.data)
            }, err => {
                reject(err)
            }).catch(err => {
                reject(err)
            })
        })
    },
    /**
     * Upload
     * @param url
     * @param formData
     * @param config
     * @returns {Promise<unknown>}
     */
    upload(url, formData, config) {
        return new Promise((resolve, reject) => {
            server({
                method: 'post',
                url: url,
                data: formData,
                headers: {
                    'content-type': 'multipart/form-data'
                },
                ...config
            }).then(res => {
                resolve(res.data)
            }, err => {
                reject(err)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

export default request
