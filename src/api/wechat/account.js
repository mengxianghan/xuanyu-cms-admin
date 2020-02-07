import request from '@/utils/request'

export default {
    getList: (params) => request.get('/wechat/account/get_list', params),
    submit: (params) => request.post('/wechat/account/submit', params),
    delete: (params) => request.post('/wechat/account/delete', params)
}
