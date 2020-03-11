import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './core/use'
import './core/permission'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
