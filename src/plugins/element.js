// 导入vue
import Vue from 'vue'
// 从element-ui里面按需导入你想要的组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 通过vue.use() 挂载所导入的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// message他的名字是自定义属性,自己取
Vue.prototype.$message = Message
