import Vue from 'vue'
import router from '@/router'
import {message} from 'ant-design-vue/es'

const state = {
    token: '',
    userId: '',
    userName: '',
    fullName: '',
    avatar: '',
    lastLoginTime: ''
}

const mutations = {
    /**
     * 设置用户信息
     * @param state
     * @constructor
     */
    SET_USER_INFO(state, payload = {}) {
        for (let key in payload) {
            state[key] = payload[key]
        }
    }
}

const actions = {
    /**
     * 登录
     * @param commit
     * @param rootState
     * @param rootAction
     * @param username
     * @param password
     * @returns {Promise<unknown>}
     */
    login({commit, dispatch, rootState}, {username = '', password = ''}) {
        return new Promise((resolve, reject) => {
            Vue.api.login.signIn({
                username: username,
                password: password
            }).then(({code, data}) => {
                if (code === '200') {
                    Vue.ls.set('userInfo', data)
                    dispatch('asyncRoutes/generateRoutes', null, {root: true}).then(() => {
                        const menu = rootState.asyncRoutes.menu
                        if (menu.length) {
                            const validRoute = getFirstValidRoute(menu)
                            const name = validRoute.name
                            router.push({name: name})
                        } else {
                            message.warning('没有任何权限，请联系站点管理员')
                        }
                    })
                    resolve(data)
                } else {
                    reject()
                }
            }, (err) => {
                reject()
            }).catch(() => {
                reject()
            })
        })
    },
    /**
     * 设置用户信息
     * @param commit
     */
    setUserInfo({commit}) {
        return new Promise((resolve, reject) => {
            const userInfo = Vue.ls.get('userInfo')
            const avatar = require('@/assets/images/logo.svg')
            if (userInfo) {
                commit('SET_USER_INFO', {
                    userId: userInfo.id,
                    userName: userInfo.username,
                    fullName: userInfo.full_name || userInfo.username,
                    avatar: userInfo.avatar || avatar,
                    lastLoginTime: userInfo.last_login_time || '',
                    token: userInfo.token
                })
                resolve(true)
            } else {
                reject()
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

/**
 * 获取第一个有效菜单
 * @param menu
 * @returns {{}}
 */
const getFirstValidRoute = (menu) => {
    let route = {}
    for (let item of menu) {
        if (item.children && item.children.length) {
            let temp = getFirstValidRoute(item.children)
            if (Object.keys(temp).length) {
                route = temp
                break
            }
        } else {
            route = item
            break
        }
    }
    return route
}
