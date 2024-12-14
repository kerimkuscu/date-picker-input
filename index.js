import DatePicker from './src/DatePicker.vue';

export default {
    install(Vue) {
        Vue.component('DatePicker', DatePicker);
    },
};

export { DatePicker };
