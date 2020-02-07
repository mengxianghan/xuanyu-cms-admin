import request from '@/utils/request'

export default {
    getData: (params) => request.get('/system/config/get_data', params),
    submit: (params) => request.post('/system/config/submit', params)
}
