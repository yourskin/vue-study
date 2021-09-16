import Vue from 'vue'

export default function create(comp, props) {
  const vm = new Vue({
    render: (h) => h(comp, { props }),
  }).$mount()
  document.body.appendChild(vm.$el)
  const component = vm.$children[0]
  component.remove = () => {
    document.body.removeChild(vm.$el)
    vm.$destroy()
  }
  return component
}
