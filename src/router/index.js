import Vue from 'vue'
import Router from 'vue-router'
import {constantRoutesMap} from "@/config/router.config"

Vue.use(Router)

export default new Router({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutesMap
})
