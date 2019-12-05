import request from '@/utils/request';

export default {
    getList: (params) => request.get('/system/menu/get_list', params),
    submit: (params) => request.post('/system/menu/submit', params),
    delete: (params) => request.post('/system/menu/delete', params),
    // 供 async router 临时使用
    getMenu: (params) => request.get('/system/menu/get_menu', params)
};
