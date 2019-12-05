import request from '@/utils/request';

export default {
    getList: (params) => request.get('/system/dict_dir/get_list', params),
    submit: (params) => request.post('/system/dict_dir/submit', params),
    delete: (params) => request.post('/system/dict_dir/delete', params)
};
