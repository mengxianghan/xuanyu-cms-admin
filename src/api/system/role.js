import request from '@/utils/request'

export default {
    getList: (params) => request.get('/system/role/get_list', params),
    submit: (params) => request.post('/system/role/submit', params),
    delete: (params) => request.post('/system/role/delete', params),
    submitAuth: (params) => request.post('/system/role/submit_auth', params)
}
