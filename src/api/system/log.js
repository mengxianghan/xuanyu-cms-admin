import request from '@/utils/request'

export default {
    getList: (params) => request.get('/system/log/get_list', params)
}
