import request from '@/utils/request'

export default {
    getList: (params) => request.get('/system/post/get_list', params),
    submit: (params) => request.post('/system/post/submit', params),
    delete: (params) => request.post('/system/post/delete', params)
}
