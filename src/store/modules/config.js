import Vue from 'vue';

const state = {
    configComplete: false,
    domainName: '',
    uploadDir: '',
    allowedFileType: '',
    allowedFileSize: 0
};

const mutations = {
    SET_CONFIG(state, payload = {}) {
        for (let key in payload) {
            state[key] = payload[key];
        }
    }
};

const actions = {
    /**
     * 设置配置信息
     * @param commit
     * @param rootState
     * @returns {Promise<void>}
     */
    async setConfig({commit, rootState}, payload = false) {
        if (!state.configComplete) {
            const {code, data} = await Vue.api.system.config.getData({
                site: rootState.app.site
            });
            if (code === '0') {
                payload = data;
            }
        }
        if (payload) {
            commit('SET_CONFIG', {
                domainName: payload.domain_name,
                uploadDir: payload.upload_dir,
                allowedFileType: payload.allowed_file_type,
                allowedFileSize: Number(payload.allowed_file_size)
            });
        }
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};