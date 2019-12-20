// 导入vue
import Vue from 'vue'
// 从element-ui里面按需导入你想要的组件
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem } from 'element-ui'

// 通过vue.use()  全局挂载所导入的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
// message他的名字是自定义属性,自己取
Vue.prototype.$message = Message
