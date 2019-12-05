import request from '@/utils/request';

export default {
    getList: (params) => request.get('/system/dept/get_list', params),
    submit: (params) => request.post('/system/dept/submit', params),
    delete: (params) => request.post('/system/dept/delete', params)
};
