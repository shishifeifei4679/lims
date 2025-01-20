import { getPermissions } from '@/api/login'
import { Loading } from 'element-ui'

const btnAuth = {
  state: {
    btnAuth: null // 每个页面按钮权限
  },
  mutations: {
    SET_AUTH: (state, btnAuth = []) => {
      state.btnAuth = btnAuth
    }
  },
  actions: {
    // 按钮权限
    getPermissions({ commit }) {
      const loadingInstance = Loading.service({
        lock: true,
        text: $i18n.t('common.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.4)'
      })
      return new Promise((resolve, reject) => {
        getPermissions()
          .then((res) => {
            const { result } = res.data
            commit('SET_AUTH', result)
            resolve(res.data)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            loadingInstance.close()
          })
      })
    }
  }
}

export default btnAuth
