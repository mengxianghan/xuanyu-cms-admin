import request from '@/utils/request'

export default {
    getMenuList: (params) => request.get('/system/auth/get_menu_list', params),
    getAlreadyAuthList: (params) => request.get('/system/auth/get_already_auth_list', params),
    submit: (params) => request.post('/system/auth/submit', params)
}
