import request from '@/utils/request'

export default {
    getList: (params) => request.get('/system/user/get_list', params),
    submit: (params) => request.post('/system/user/submit', params),
    delete: (params) => request.post('/system/user/delete', params)
}
