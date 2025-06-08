import "./assets/main.css";
// 引入全局样式
import "ant-design-vue/dist/reset.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
// 引入 ant-design-vue
import Antd from "ant-design-vue";
import FormCreate from "@form-create/ant-design-vue";
// 引入element
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);

// 使用 ant-design-vue
app.use(Antd);
app.use(FormCreate);
app.use(createPinia());
app.use(router);
app.use(ElementPlus)
app.mount("#app");
