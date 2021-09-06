let Vue

class VueRouter {
  constructor(options) {
    this.$options = options
    Vue.util.defineReactive(
      this,
      'current',
      window.location.hash.slice(1) || '/'
    )
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1)
    })
  }
}
// 插件的install方法 会传入Vue构造函数
VueRouter.install = function(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    },
  })
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    render(h) {
      return h('a', { attrs: { href: `#${this.to}` } }, this.$slots.default)
    },
  })
  Vue.component('router-view', {
    render(h) {
      const { $options, current } = this.$router
      const currentRoute = $options.routes.find((item) => item.path === current)
      let component = null
      if (currentRoute) {
        component = currentRoute.component
      }
      return h(component)
    },
  })
}

export default VueRouter
