import request from '@/utils/request';

export default {
    //获取列表
    getList: (params) => request.get('/system/upload/get_list', params),
    //获取回填列表
    getBackfillList: (params) => request.post('/system/upload/get_backfill_list', params),
    //上传
    doUpload: (params, config) => request.upload('/system/upload/do_upload', params, config),
    //删除
    delete: (params) => request.post('/system/upload/delete', params)
};