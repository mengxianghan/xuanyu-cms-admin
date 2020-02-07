import request from '@/utils/request'

export default {
    getList: (params) => request.get('/system/upload_dir/get_list', params),
    submit: (params) => request.post('/system/upload_dir/submit', params),
    delete: (params) => request.post('/system/upload_dir/delete', params)
}
