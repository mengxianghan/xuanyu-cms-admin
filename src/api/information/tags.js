import request from '@/utils/request';

export default {
    getList: (params) => request.get('/information/tags/get_list', params),
    submit: (params) => request.post('/information/tags/submit', params),
    delete: (params) => request.post('/information/tags/delete', params),
    replace: (params) => request.post('/information/tags/replace', params),
};