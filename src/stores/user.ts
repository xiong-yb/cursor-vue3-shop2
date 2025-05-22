import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mailLogin, refreshToken, getUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const userId = ref<number | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshTokenStr = ref<string | null>(null)
  const expiresTime = ref<number | null>(null)
  const userInfo = ref<any>(null)

  const isLoggedIn = computed(() => !!accessToken.value)

  // 从 localStorage 恢复登录状态
  const restoreLoginState = () => {
    const storedUserId = localStorage.getItem('userId')
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    const storedExpiresTime = localStorage.getItem('expiresTime')

    if (storedUserId && storedAccessToken && storedRefreshToken && storedExpiresTime) {
      userId.value = parseInt(storedUserId)
      accessToken.value = storedAccessToken
      refreshTokenStr.value = storedRefreshToken
      expiresTime.value = parseInt(storedExpiresTime)
    }
  }

  // 保存登录状态到 localStorage
  const saveLoginState = (data: {
    userId: number
    accessToken: string
    refreshToken: string
    expiresTime: number
  }) => {
    userId.value = data.userId
    accessToken.value = data.accessToken
    refreshTokenStr.value = data.refreshToken
    expiresTime.value = data.expiresTime

    localStorage.setItem('userId', data.userId.toString())
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('expiresTime', data.expiresTime.toString())
  }

  // 清除登录状态
  const clearLoginState = () => {
    userId.value = null
    accessToken.value = null
    refreshTokenStr.value = null
    expiresTime.value = null
    userInfo.value = null

    localStorage.removeItem('userId')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expiresTime')
  }

  // 登录
  const login = async () => {
    try {
      const { data } = await mailLogin()
      if (data.code === 0) {
        saveLoginState(data.data)
        return true
      }
      return false
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  // 刷新 token
  const refreshUserToken = async () => {
    if (!refreshTokenStr.value) return false
    try {
      const { data } = await refreshToken()
      if (data.code === 0) {
        saveLoginState(data.data)
        return true
      }
    } catch (error) {
      console.error('刷新 token 失败:', error)
    }
    return false
  }

  // 检查登录状态
  const checkLogin = () => {
    return !!accessToken.value
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const { data } = await getUserInfo()
      if (data.code === 0) {
        userInfo.value = data.data
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  // 初始化时恢复登录状态
  restoreLoginState()

  return {
    userId,
    accessToken,
    refreshTokenStr,
    expiresTime,
    userInfo,
    isLoggedIn,
    login,
    refreshUserToken,
    checkLogin,
    clearLoginState,
    fetchUserInfo,
    saveLoginState
  }
}) 