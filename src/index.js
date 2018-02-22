import scrollBar from './lib/components/scroll-bar.vue';

const scrollBar = {
    scrollBar
};

const install = function(Vue, opts = {}) {
    Vue.component(scrollBar.name, scrollBar);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default Object.assign(scrollBar, {install});