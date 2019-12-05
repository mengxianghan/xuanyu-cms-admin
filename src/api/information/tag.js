import request from '@/utils/request';

export default {
    getList: (params) => request.get('/information/tag/get_list', params),
    submit: (params) => request.post('/information/tag/submit', params),
    delete: (params) => request.post('/information/tag/delete', params),
    replace: (params) => request.post('/information/tag/replace', params),
};