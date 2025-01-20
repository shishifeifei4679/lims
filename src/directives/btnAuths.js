import store from '@/store'
const btnAuths = {
  bind: function (el, binding, vnode) {
    // 在被绑定的元素插入到dom中时
    if (!binding.value) return
    const btnAuths = store.getters.btnAuths || [] // 系统页面权限
    if (!btnAuths.includes(binding.value)) {
      el.style = 'display:none'
    }
  }
}
export default btnAuths
