import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 直接导入plugins里面的element.js
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
// 导入面包屑
import Mbx from './components/Mbx.vue'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.component('Mbx', Mbx)
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
// 时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  // 年份
  const y = dt.getFullYear()
  // 月份
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  // 日期
  const d = (dt.getDate() + '').padStart(2, '0')
  // 小时
  const hh = (dt.getHours() + '').padStart(2, '0')
  // 分钟
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  //  秒数
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
