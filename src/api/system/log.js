import request from '@/utils/request';

export default {
    getList: (params) => request.get('/system/login_log/get_list', params)
};