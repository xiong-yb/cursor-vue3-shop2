import request from '@/utils/request'
import type { LoginParams, RegisterParams, ResetPasswordParams, UserInfo, ApiResponse } from './types'

// 用户登录
export function login(data: LoginParams) {
  return request<ApiResponse<{ token: string }>>({
    url: '/user/login',
    method: 'post',
    data
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

// 获取用户信息
export function getUserInfo() {
  return request<ApiResponse<UserInfo>>({
    url: '/user/info',
    method: 'get'
  })
}

// 更新用户信息
export function updateUserInfo(data: Partial<UserInfo>) {
  return request<ApiResponse>({
    url: '/user/update',
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