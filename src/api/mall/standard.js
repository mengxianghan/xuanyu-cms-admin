import request from '@/utils/request'

export default {
    getList: (params) => request.get('/mall/standard/get_list', params),
    submit: (params) => request.post('/mall/standard/submit', params),
    delete: (params) => request.post('/mall/standard/delete', params)
}
