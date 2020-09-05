import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
// import 'lib-flexible/flexible.js'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import {_axios, post, get} from './config/axios'
import common from './assets/js/common'
// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'lib-flexible'
import 'moment/locale/zh-cn';
import qs from 'qs'
console.log(qs)
Vue.prototype.$qs = qs
moment.locale('zh-cn');

Vue.use(Antd)

//引入elementui
// import 'element-ui/lib/theme-chalk/index.css'
import element from './element/index'
Vue.use(element)

import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

Vue.prototype.common = common;
Vue.prototype.$axios = _axios;
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.imgUrl = 'http://47.92.64.11:8877/';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// ;(function(){
//   var rem = document.createElement('script');
//   rem.src = './rem.js';
//   document.body.appendChild(rem)
// })()