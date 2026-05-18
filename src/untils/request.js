import axios from 'axios'
import { ElMessage } from 'element-plus'


//创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 5000
})

//请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, config } = response
    if (data.code == 200) {
      return data.data
    } else {
      if (data.code === '-1') {
        if (!config.url.includes('/login')) {
          const msg = data.msg || data.message || ''
          const isAuthError = /登录|token|认证|过期|未登录|Token/i.test(msg)
          if (isAuthError) {
            ElMessage.error(msg || '登录过期，请重新登录')
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            import('@/router').then(mod => {
              mod.default.push('/auth/login')
            })
          } else {
            ElMessage.error(msg || '请求失败')
            return Promise.reject(msg || '请求失败')
          }
        } else {
          ElMessage.error(data.msg || '登录失败')
          return Promise.reject(data.msg || '登录失败')
        }
      } else {
        ElMessage.error(data.msg || '请求失败')
        return Promise.reject(data.msg || '请求失败')
      }
    }
  },
  (error) => {
    ElMessage.error('网络请求失败')
    return Promise.reject(error)
  }
)

export default service
