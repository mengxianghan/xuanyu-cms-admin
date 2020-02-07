import request from '@/utils/request'

export default {
    getData: (params) => request.get('/information/single/get_data', params),
    submit: (params) => request.post('/information/single/submit', params),
}
