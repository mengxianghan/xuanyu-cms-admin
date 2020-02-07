import request from '@/utils/request'

export default {
    getList: (params) => request.get('/mall/goods/get_list', params),
    submit: (params) => request.post('/mall/goods/submit', params),
    delete: (params) => request.post('/mall/goods/delete', params)
}
