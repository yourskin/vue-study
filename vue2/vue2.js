class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    proxy(this)
    obsever(this.$data)
    this.$el = document.querySelector(options.el)
    this.compile(this.$el)
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
  constructor(vm, key, updateFn) {
    this.vm = vm
    this.key = key
    Dep.target = this
    this.vm[this.key]
    Dep.target = null
    this.updateFn = updateFn
  }

  update() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

// 派发watcher动作
class Dep {
  constructor() {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
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
