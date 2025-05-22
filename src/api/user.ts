import request from '@/utils/request'
import type { RegisterParams, ResetPasswordParams, ApiResponse } from './types'

// 邮箱登录 - 使用测试数据
export function mailLogin() {
  // 模拟登录成功
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        userId: 288,
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
        expiresTime: Date.now() + 24 * 60 * 60 * 1000 // 24小时后过期
      },
      msg: ''
    }
  })
}

// 获取用户信息 - 使用测试数据
export function getUserInfo() {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        id: 288,
        nickname: '测试用户',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        mobile: '13800138000',
        mail: 'test@example.com',
        sex: 1,
        point: 100,
        experience: 500,
        level: 'VIP1',
        brokerageEnabled: true
      },
      msg: ''
    }
  })
}

// 刷新token - 使用测试数据
export function refreshToken() {
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        userId: 288,
        accessToken: 'new_test_access_token',
        refreshToken: 'new_test_refresh_token',
        expiresTime: Date.now() + 24 * 60 * 60 * 1000
      },
      msg: ''
    }
  })
}

// 用户注册
export function register(data: RegisterParams) {
  return request<ApiResponse>({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 发送重置密码验证码
export function sendResetCode(email: string) {
  return request<ApiResponse>({
    url: '/user/send-reset-code',
    method: 'post',
    data: { email }
  })
}

// 重置密码
export function resetPassword(data: ResetPasswordParams) {
  return request<ApiResponse>({
    url: '/user/reset-password',
    method: 'post',
    data
  })
}

// 更新用户信息
export function updateUserInfo(data: {
  nickname?: string
  avatar?: string
  sex?: number
}) {
  return request<ApiResponse<boolean>>({
    url: '/member/user/update',
    method: 'put',
    data
  })
}

// 修改密码
export function changePassword(oldPassword: string, newPassword: string) {
  return request<ApiResponse>({
    url: '/user/change-password',
    method: 'post',
    data: { oldPassword, newPassword }
  })
} 