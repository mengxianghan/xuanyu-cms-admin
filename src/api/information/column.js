import request from '@/utils/request'

export default {
    getList: (params) => request.get('/information/column/get_list', params),
    submit: (params) => request.post('/information/column/submit', params),
    delete: (params) => request.post('/information/column/delete', params)
}
