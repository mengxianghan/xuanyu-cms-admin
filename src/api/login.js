import request from '@/utils/request'

export default {
    signIn: (params) => request.post('/login/sign_in', params)
}
