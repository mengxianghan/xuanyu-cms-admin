import request from '@/utils/request';

export default {
    getList: (params) => request.get('/mall/category/get_list', params),
    submit: (params) => request.post('/mall/category/submit', params),
    delete: (params) => request.post('/mall/category/delete', params)
};
