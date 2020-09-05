import axios from 'axios';
import qs from 'qs';
var _ = require('lodash')
// import router from '../router.js';
// 环境的切换
var baseURL = ''
if (process.env.NODE_ENV == 'development') {
  baseURL = '/api';
} else if (process.env.NODE_ENV == 'debug') {
  baseURL = '';
} else if (process.env.NODE_ENV == 'production') {
  baseURL = 'https://hanshe.hsretreats.com';
  // baseURL = 'http://47.92.64.11:8877/';
}
// axios 配置
const _axios = axios.create({
  timeout: 10000,
  baseURL
})
import { Loading, Message } from 'element-ui'

let loading

function startLoading() {
  loading = Loading.service({
    lock: true,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    loading.close()
  }
}

//全局loading
var needLoadingRequestCount = 0

var showFullScreenLoading = function() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

var tryHideFullScreenLoading = function() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  // if (needLoadingRequestCount > 0) needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    _.debounce(tryCloseLoading, 300)()
  }
}
// http request拦截器
_axios.interceptors.request.use(
  config => {
    // console.log('请求体',config)
    if(config.headers.showLoading){
      showFullScreenLoading()
    }
    // 判断token是否存在
    if (localStorage.getItem('hsToken')) {
      config.headers.token = localStorage.getItem('hsToken')
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
_axios.interceptors.response.use(
  response => {
    // console.log('响应体',response.config)
    if (response.config.headers.showLoading) {
      tryHideFullScreenLoading()
    }
    return response;
  },
  err => {
    return Promise.reject(err);
  }
)
var post = (url, data) => {
  return new Promise((resolve, reject) => {
    _axios({
      method: 'post',
      url,
      data,
      headers: {
        'showLoading': false
      }
    })
    .then(res => {
      resolve(res)
    })
    .catch(err => {
      reject(err)
    })
  })
} 
var get = (url, data) => {
  return new Promise((resolve, reject) => {
    _axios({
      method: 'get',
      url,
      data,
      headers: {
        'showLoading': false
      }
    })
    .then(res => {
      resolve(res)
    })
    .catch(err => {
      reject(err)
    })
  })
} 
export {
  _axios,
  post,
  get
} 

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
*/
// export function fetch(url, params = {}) {
//   return new Promise((resolve, reject) => {
//     axios.get(url, {
//       params: params
//     })
//       .then(response => {
//         resolve(response.data);
//       })
//       .catch(err => {
//         reject(err)
//       })
//   })
// }
// /**
//  * 封装post请求
//  * @param url
//  * @param data
//  * @returns {Promise}
//  */

// export function post(url, data = {}, config = {}) {
//   return new Promise((resolve, reject) => {
//     axios.post(url, data, config)
//       .then(response => {
//         resolve(response.data);
//       }, err => {
//         reject(err)
//       })
//   })
// }