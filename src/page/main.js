import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn';
import App from './App.vue';

// 将自动设置 Day.js 的国际化设置为 'zh-cn'
const app = createApp(App);
app.use(ElementPlus, { locale });

app.mount('#app');
