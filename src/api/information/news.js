import request from '@/utils/request'

export default {
    getList: (params) => request.get('/information/news/get_list', params),
    submit: (params) => request.post('/information/news/submit', params),
    delete: (params) => request.post('/information/news/delete', params),
    batchDelete: (params) => request.post('/information/news/delete', params)
}
