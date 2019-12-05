import request from '@/utils/request';

export default {
    getList: (params) => request.get('/system/dict/get_list', params),
    submit: (params) => request.post('/system/dict/submit', params),
    delete: (params) => request.post('/system/dict/delete', params)
};
