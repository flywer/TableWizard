import {createApp} from 'vue';
import naive from "naive-ui";
import App from './App.vue'
import {router} from "@render/router";

import pinia from "@render/plugins/pinia";

// https://unocss.dev/ 原子 css 库
import '@unocss/reset/tailwind-compat.css' // unocss reset
import 'virtual:uno.css'

// 全局样式
import '@render/styles/global.css'

import 'animate.css';

createApp(App)
	.use(naive)
	.use(router)
	.use(pinia)
	.mount('#app')
