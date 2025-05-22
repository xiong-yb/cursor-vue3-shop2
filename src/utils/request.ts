import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { refreshToken } from '@/api/user'
// import { useUserStore } from '@/stores/user'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL + import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    // Accept: 'text/json',
    Accept: '*/*',
    'tenant-id': import.meta.env.VITE_APP_TENANT_ID,
    // 'Authorization': 'Bearer test247',
    'Content-Type': 'application/json',
  },
})

// 是否正在刷新token
let isRefreshing = false
// 重试队列
let retryRequests: Function[] = []

// 请求拦截器
service.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 添加租户ID
    config.headers['tenant-id'] = import.meta.env.VITE_APP_TENANT_ID

    // 获取token
    const accessToken = localStorage.getItem('accessToken')
    const tokenExpiresTime = localStorage.getItem('tokenExpiresTime')
    
    if (accessToken) {
      // 检查token是否过期
      const now = Date.now()
      const expiresTime = tokenExpiresTime ? parseInt(tokenExpiresTime) : 0
      
      if (now >= expiresTime) {
        // token已过期
        if (!isRefreshing) {
          isRefreshing = true
          try {
            // 尝试刷新token
            const refreshTokenStr = localStorage.getItem('refreshToken')
            if (refreshTokenStr) {
              const { data } = await refreshToken()
              
              // 更新token
              localStorage.setItem('accessToken', data.data.accessToken)
              localStorage.setItem('refreshToken', data.data.refreshToken)
              localStorage.setItem('tokenExpiresTime', data.data.expiresTime.toString())
              
              // 更新store
              // const userStore = useUserStore()
              // userStore.setUser({
              //   userId: data.data.userId,
              //   token: data.data.accessToken,
              //   refreshToken: data.data.refreshToken,
              //   expiresTime: data.data.expiresTime
              // })
              
              // 重试队列中的请求
              retryRequests.forEach(cb => cb(data.data.accessToken))
              retryRequests = []
              
              // 更新当前请求的token
              config.headers['Authorization'] = `Bearer ${data.data.accessToken}`
            } else {
              // 没有refreshToken，直接登出
              handleLogout()
            }
          } catch (error) {
            // 刷新token失败，直接登出
            handleLogout()
            return Promise.reject(error)
          } finally {
            isRefreshing = false
          }
        } else {
          // 正在刷新token，将请求加入重试队列
          return new Promise(resolve => {
            retryRequests.push((token: string) => {
              config.headers['Authorization'] = `Bearer ${token}`
              resolve(config)
            })
          })
        }
      } else {
        // token未过期，直接使用
        config.headers['Authorization'] = `Bearer ${accessToken}`
      }

    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    if (response.status !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return response
  },
  (error) => {
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

// 处理登出
const handleLogout = () => {
  // const userStore = useUserStore()
  // userStore.clearUser()
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('tokenExpiresTime')
  
  // 触发登录弹窗
  window.dispatchEvent(new CustomEvent('show-login-dialog'))
}

export default service 