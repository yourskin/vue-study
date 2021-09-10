class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    proxy(this)
    obsever(this.$data)
    // this.compile(this.$el)
    this.$mount(options.el)
  }

  $mount(el) {
    this.$el = document.querySelector(el)
    const updateComponent = () => {
      const vnode = this.$options.render.call(this, this.$createElment)
      this._update(vnode)
    }
    new Watcher(this.$el, updateComponent)
  }

  $createElment(tag, data, children) {
    return { tag, data, children }
  }

  _update(vnode) {
    const prevNode = this._vnode
    if (!prevNode) {
      // 創建
      this.__patch__(this.$el, vnode)
    } else {
      this.__patch__(prevNode, vnode)
    }
  }

  __patch__(oldVnode, vnode) {
    if (oldVnode.nodeType) {
      const el = this.createElm(vnode)
      const parent = oldVnode.parentElement
      const refElm = oldVnode.nextSibling
      parent.insertBefore(el, refElm)
      parent.removeChild(oldVnode)
    } else {
      const el = (vnode.el = oldVnode.el)
      if (oldVnode.tag === vnode.tag) {
        if (typeof oldVnode.children === 'string') {
          if (typeof vnode.children === 'string') {
            el.textContent = vnode.children
          } else {
            el.innerHTML = ''
            oldVnode.children.forEach((child) => {
              el.appendChild(this.createElm(child))
            })
          }
        } else {
          if (typeof vnode.children === 'string') {
            el.textContent = vnode.children
          } else {
            this.updateChildren(el, oldVnode.children, vnode.children)
          }
        }
      } else {
      }
    }
    this._vnode = vnode
  }

  createElm(vnode) {
    const node = document.createElement(vnode.tag)
    if (typeof vnode.children === 'string') {
      node.textContent = vnode.children
    } else {
      vnode.children.forEach((n) => {
        node.appendChild(this.createElm(n))
      })
    }
    vnode.el = node
    return node
  }

  updateChildren(parentElm, oldCh, newCh) {
    // 这⾥暂且直接patch对应索引的两个节点
    const len = Math.min(oldCh.length, newCh.length)
    for (let i = 0; i < len; i++) {
      this.__patch__(oldCh[i], newCh[i])
    }
    // newCh若是更⻓的那个，说明有新增
    if (newCh.length > oldCh.length) {
      newCh.slice(len).forEach((child) => {
        const el = this.createElm(child)
        parentElm.appendChild(el)
      })
    } else if (newCh.length < oldCh.length) {
      // oldCh若是更⻓的那个，说明有删减
      oldCh.slice(len).forEach((child) => {
        parentElm.removeChild(child.el)
      })
    }
  }

  // 派发更新标签动作
  update(node, type, key) {
    const fn = this[`${type}Updater`]
    fn && fn(node, this.$data[key])
    new Watcher(this.$data, key, function (val) {
      fn && fn(node, val)
    })
  }

  isElement(node) {
    return node.nodeType === 1
  }

  isText(node) {
    return node.nodeType === 3 && /\{\{ (.*) \}\}/.test(node.textContent)
  }

  textUpdater(node, value) {
    node.textContent = value
  }

  htmlUpdater(node, value) {
    node.innerHTML = value
  }

  // 是否是自定义指令
  isDir(node) {
    Array.from(node.attributes).forEach((attr) => {
      if (attr.name.startsWith('k-')) {
        this.update(node, attr.name.slice(2), attr.value)
      }
    })
  }

  // 编译template
  compile(el) {
    Array.from(el.childNodes).forEach((node) => {
      if (this.isElement(node)) {
        // 元素节点
        this.isDir(node)
      } else if (this.isText(node)) {
        //  文本节点并且是插值表达式
        this.update(node, 'text', RegExp.$1)
      }
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }
}

// 值发生更改重新渲染页面
class Watcher {
  constructor(vm, fn) {
    this.vm = vm
    this.getter = fn
    this.get()
  }

  get() {
    Dep.target = this
    this.getter.call(this.vm)
    Dep.target = null
  }

  update() {
    this.get()
  }
}

// 派发watcher动作
class Dep {
  constructor() {
    this.deps = new Set()
  }

  addDep(dep) {
    this.deps.add(dep)
  }

  notify() {
    this.deps.forEach((dep) => dep.update())
  }
}

// 代理方法：this.count
function proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(val) {
        vm.$data[key] = val
      },
    })
  })
}

// 监听方法
function defineReactive(obj, key, value) {
  obsever(value)
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.addDep(Dep.target)
      return value
    },
    set(val) {
      if (val !== value) {
        value = val
        dep.notify()
      }
    },
  })
}

// 确保对象的每个key都有监听
function obsever(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return
  }
  for (let key in obj) {
    defineReactive(obj, key, obj[key])
  }
}
