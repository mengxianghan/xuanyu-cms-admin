/**
 * 路由基本结构及说明
 * @type {
 *      path: string, // 路由地址
 *      name: string, // 路由名称
 *      component: ()=>import(), // 路由页面
 *      redirect: string, // 重定向
 *      meta: {
 *          id: string,
 *          title: string, // 标题
 *          icon: string, // 图标
 *          hidden: boolean, // 是否在显示在菜单中
 *          action: string, // 权限：insert,insertNext,edit,delete
 *          isExternal: boolean // 是否外部链接
 *      }
 * }
 */

/**
 * 基础路由
 */
export const constantRoutesMap = [
    {
        path: '/',
        redirect: '/user/login',
        meta: {
            hidden: true
        }
    },
    {
        path: '/user/login',
        name: 'login',
        component: () => import('@/views/user/login/login'),
        meta: {
            hidden: true
        }
    },
    {
        path: '/exception/404',
        component: () => import('@/views/exception/404'),
        meta: {
            hidden: true
        }
    }
];

/**
 * 找到页面的路由
 */
export const notFoundRouter = {
    path: '*',
    redirect: '/404',
    meta: {
        hidden: true
    },
};

/**
 * 免登录白名单
 */
export const whiteList = ['login'];