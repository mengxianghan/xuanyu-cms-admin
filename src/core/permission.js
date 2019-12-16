import Vue from "vue";
import router from '@/router';
import store from '@/store';

import NProgress from 'nprogress';

import {whiteList} from "@/config/router.config";

router.beforeEach((to, from, next) => {
    NProgress.start();
    if (whiteList.includes(to.name)) { // 在白名单
        next();
    } else { // 不在白名单
        store.dispatch('user/setUserInfo').then(res => {
            if (res) { // 已登录
                // 设置配置信息
                if (!store.state.config.configComplete) {
                    store.dispatch('config/setConfig');
                }
                if (store.state.asyncRoutes.routesComplete) { // 路由加载完成
                    next();
                } else { // 路由未加载，执行加载
                    store.dispatch('asyncRoutes/generateRoutes').then((routes) => {
                        next({...to, replace: true});
                    });
                }
            } else { // 未登录
                next({name: 'login', replace: true});
            }
        });
    }
});

router.afterEach((to, from) => {
    NProgress.done();
});