import request from '@/utils/request'

export default {
    getList: (params) => request.get('/mall/brand/get_list', params),
    submit: (params) => request.post('/mall/brand/submit', params),
    delete: (params) => request.post('/mall/brand/delete', params)
}
