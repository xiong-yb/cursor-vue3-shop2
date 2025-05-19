// 用户相关类型
export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  email: string
  phone: string
}

export interface ResetPasswordParams {
  email: string
  code: string
  newPassword: string
}

export interface UserInfo {
  id: number
  username: string
  email: string
  phone: string
  avatar?: string
}

// 购物车相关类型
export interface CartItem {
  id: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    image: string
  }
}

// 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
} 