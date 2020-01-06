import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 直接导入plugins里面的element.js
// import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// // 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
// 导入面包屑
import Mbx from './components/Mbx.vue'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式

// 导入Nprogress包对应 的js和css
import Nprogress from 'nprogress'


import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request 拦截器中展示进度条
axios.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中   隐藏进度条
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
Vue.component('Mbx', Mbx)

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
