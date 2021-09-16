import Vue from 'vue'
import App from './App.vue'
import create from '@/components/Notice/create'
import Notice from '@/components/Notice/Notice'

Vue.config.productionTip = false

Vue.prototype.$notice = (props) => create(Notice, props).show()

new Vue({
  render: (h) => h(App),
}).$mount('#app')
