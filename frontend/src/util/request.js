import axios from 'axios'
import { Modal } from 'ant-design-vue'
import store from '../store/index'
import router from '../router'
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  headers: {
    Accept: 'application/json, text/plain, */*'
  },
  timeout: 15000
})
instance.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers.Authorization = 'Bearer ' + store.getters.token
  }
  return config
}, error => {
  Promise.reject(error)
})
instance.interceptors.response.use(response => {
  if (store.getters.debug && response.data.debug) {
    store.commit('ADD_LOG', response.data.debug)
  }
  return Promise.resolve(response.data)
}, error => {
  if (error.response) {
    if (store.getters.debug && error.response.data.debug) {
      store.commit('ADD_LOG', error.response.data.debug)
    }
    switch (error.response.status) {
      case 401: {
        Modal.error({
          title: '登录已失效',
          centered: true,
          onOk () {
            store.dispatch('frontendLogout').then(() => {
              window.location.reload()
            })
          }
        })
        return Promise.reject(error)
      }
      case 403: {
        router.push('/403')
        return Promise.reject(error)
      }
      case 404: {
        // modeL->findOrFail 的统一处理
        Modal.error({
          title: '数据找不到了!请刷新页面重试',
          centered: true
        })
        return Promise.reject(error)
      }
      case 422: {
        // 后端requestForm 验证失败的统一处理
        const data = error.response.data
        for (const x in data.errors) {
          for (const msg of data.errors[x]) {
            Modal.error({
              title: msg,
              centered: true
            })
            return Promise.reject(data)
          }
        }
        break
      }
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
        Modal.error({
          title: '服务器出了点小差',
          centered: true
        })
        return Promise.reject(error.response)
    }
  } else {
    if (error.message === 'Network Error') {
      Modal.error({
        title: 'network error',
        centered: true
      })
    } else if (error.code && error.code === 'ECONNABORTED') {
      Modal.error({
        title: '请求服务器超时',
        centered: true
      })
    }
    return Promise.reject(error)
  }
})
export default instance
