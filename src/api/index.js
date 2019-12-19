import system from './system';
import information from './information';
import login from './login';
import wechat from './wechat';

const api = {
    vm: {},
    install(Vue, options) {
        if (this.installed) {
            return;
        }
        this.installed = true;

        const api = {
            system,
            information,
            login,
            wechat
        };

        Vue.api = api;
        Object.defineProperty(Vue.prototype, '$api', {
            get() {
                return api;
            }
        });
    }
};

export default api;
