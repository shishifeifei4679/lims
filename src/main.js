import './public-path'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import clearKeepAliveCache from '@/utils/clearKeepAliveCache'

Vue.config.productionTip = false
Vue.prototype.isMicro = window.__POWERED_BY_QIANKUN__

// 安装插件
import '@/plugins'

// 注册全局组件
import '@/components/gobalComponents.js'

// 系统初始化样式
import '@/scss/reset.css'

// 自定义指令
import '@/directives'
import "@/directives/zn-en.js";
// 引入icon
import "@/icons/iconfont.css"

// 注册国际化
import i18n from '@/lang/index'

let vm = null;
function render(props = {}) {
  const { container } = props;
  vm = new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
  Vue.prototype.closeTab = props.closeTab || null;  // 增加全局的关闭选项卡功能，如果子应用独立运行，就是null
}

export let cachedInstanceMap = {};  // keep-alive缓存列表

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}

export async function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    if(state['lims'] && Array.isArray(state['lims']) && state['lims'].length > 0) {
      clearKeepAliveCache(state['lims']);
    } else if (state.refreshButtonAuth) {
      // 刷新按钮权限
      console.log('开始清空按钮权限');
      store.commit('SET_AUTH', null)
      console.log('已清空按钮权限');
    } else {
      cachedInstanceMap = {}
    }
    // 处理刷新页面
    state['refreshKey'] && store.commit('SET_REFRESH_KEY', state['refreshKey']);
  });
  render(props);
}

export async function unmount() {
  vm.$destroy();
  vm.$el.innerHTML = '';
  vm = null;
}

