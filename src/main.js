import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 直接导入plugins里面的element.js
import './plugins/element.js'

// 手动配置elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
