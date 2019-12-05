import request from '@/utils/request';

export default {
    getList: (params) => request.get('/system/auth_button/get_list', params),
    submit: (params) => request.post('/system/auth_button/submit', params),
    delete: (params) => request.post('/system/auth_button/delete', params)
};