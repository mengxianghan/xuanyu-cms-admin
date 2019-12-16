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
    async setConfig({commit, rootState}) {
        const {code, data} = await Vue.api.system.config.getData({
            site: rootState.app.site
        });
        if (code === '0') {
            commit('SET_CONFIG', {
                configComplete: true,
                domainName: data.domain_name,
                uploadDir: data.upload_dir,
                allowedFileType: data.allowed_file_type,
                allowedFileSize: Number(data.allowed_file_size)
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