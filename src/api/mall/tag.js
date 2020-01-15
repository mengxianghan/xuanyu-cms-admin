import request from '@/utils/request';

export default {
    getList: (params) => request.get('/mall/tag/get_list', params),
    submit: (params) => request.post('/mall/tag/submit', params),
    delete: (params) => request.post('/mall/tag/delete', params)
};