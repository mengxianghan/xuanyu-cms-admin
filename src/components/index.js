const install = (Vue, options) => {
    const components = require.context('.', true, /.*\.vue$/);
    components.keys().forEach(fileName => {
        const compConf = components(fileName)['default'];
        if (compConf.name) {
            Vue.component(compConf.name, compConf);
        }
    });
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default install;