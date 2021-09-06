let Vue

class Store {
  constructor(options) {
    this._vm = new Vue({
      data() {
        return {
          $$state: options.state,
        }
      },
    })
    this.mutations = options.mutations
    this.actions = options.actions
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  get state() {
    return this._vm._data.$$state
  }

  set state(v) {
    console.error('请使用replaceState()去修改')
  }

  commit(type, payload) {
    const func = this.mutations[type]
    if (!func) {
      console.error('请传入正确的commit')
      return
    }
    func(this.state, payload)
  }

  dispatch(type, payload) {
    const func = this.actions[type]
    if (!func) {
      console.error('请传入正确的dispatch')
      return
    }
    func(this, payload)
  }
}

function install(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    },
  })
}

export default { install, Store }
