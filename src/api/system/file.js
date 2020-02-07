import request from '@/utils/request'

export default {
    getList: (params) => request.get('/system/file/get_list', params),
    rename: (params) => request.post('/system/file/rename', params),
    submit: (params) => request.post('/system/role/submit', params),
    delete: (params) => request.post('/system/role/delete', params)
}
