import Vue from 'vue'  // 导入 Vue
import App from './App.vue'  // 导入根组件

Vue.config.productionTip = false  // 禁用生产模式下的提示

// 创建并挂载 Vue 实例
new Vue({
  render: h => h(App)  // 渲染 App 组件
}).$mount('#app')  // 挂载到 id 为 'app' 的 DOM 元素
