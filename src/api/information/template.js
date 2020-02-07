import request from '@/utils/request'

export default {
    getList: (params) => request.get('/information/template/get_list', params),
    submit: (params) => request.post('/information/template/submit', params),
    delete: (params) => request.post('/information/template/delete', params),
}
