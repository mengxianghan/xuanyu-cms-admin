import Vue from 'vue'
import router from "@/router"
import {constantRoutesMap, notFoundRouter} from '@/config/router.config'
import {stringToBoolean, isExternal} from '@/utils/util'

const state = {
    menu: [],
    routes: constantRoutesMap,
    addRoutes: [],
    routesComplete: false
}

const mutations = {
    SET_ROUTERS(state, routes) {
        state.addRoutes = routes
        state.routes = [...state.routes, ...routes]
        state.routesComplete = true
        state.menu = generatorMenu(state.routes)
    }
}

const actions = {
    generateRoutes({commit}) {
        return new Promise((resolve, reject) => {
            const {id: userId} = Vue.ls.get('userInfo')
            Vue.api.system.auth.getMenuList({
                id: userId,
                type: '2'
            }).then(({code, data: {list}}) => {
                const routes = generator(list)
                routes.push(notFoundRouter)
                commit('SET_ROUTERS', routes)
                // 动态添加路由
                router.addRoutes(routes)
                resolve(routes)
            }, err => {
                reject(err)
            }).catch(err => {
                reject(err)
            })
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
 * 格式化树形结构数据 生成 vue-router 层级路由
 * @param routerMap
 * @returns {*}
 */
const generator = (routesMap, parent) => {
    return routesMap.map(item => {
        const currentRouter = {
            path: item.route_path || `${parent && parent.path || ''}/${item.route_name}`,
            name: item.route_name,
            component: () => import(`@/${item.route_component}`),
            meta: {
                id: item.id, // 菜单 id
                title: item.name, // 页面名称
                icon: item.icon, // 菜单图标
                hidden: stringToBoolean(item.hidden), // 是否隐藏菜单
                action: item.auth_key, // 权限
                isExternal: isExternal(item.route_path), // 是否外部链接
            }
        }
        // 重定向
        // item.redirect && (currentRouter.redirect = item.redirect);
        // 是否有子菜单，并递归处理
        if (item.children && item.children.length > 0) {
            currentRouter.children = generator(item.children, currentRouter)
        }
        return currentRouter
    })
}

/**
 * 生成菜单
 * @param routes
 * @returns {*}
 */
const generatorMenu = (routes) => {
    return routes.filter(item => {
        if (item.hasOwnProperty('meta') && item.meta.hasOwnProperty('hidden') && !item.meta.hidden) {
            const currentMenu = item
            if (item.children && item.children.length > 0) {
                currentMenu.children = generatorMenu(item.children)
            }
            return currentMenu
        }
    })
}
