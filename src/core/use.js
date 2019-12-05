import Vue from 'vue';

// base library
import Antd from 'ant-design-vue';
import XUI from '@/components';
import 'ant-design-vue/dist/antd.css';

// extra library
import VueStorage from "vue-ls";
import api from '@/api';
import 'nprogress/nprogress.css';
import '@/core/directive';
import '@/assets/scss/index.scss';

Vue.use(Antd);
Vue.use(XUI);
Vue.use(api);
Vue.use(VueStorage, {
    namespace: 'xcms_',
    name: 'ls',
    storage: 'local'
});