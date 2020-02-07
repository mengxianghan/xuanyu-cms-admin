import request from '@/utils/request'

export default {
    getList: (params) => request.get('/mall/classify/get_list', params),
    submit: (params) => request.post('/mall/classify/submit', params),
    delete: (params) => request.post('/mall/classify/delete', params)
}
