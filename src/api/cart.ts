import request from '@/utils/request'
import type { CartItem, ApiResponse } from './types'

// 获取购物车列表
export function getCartList() {
  return request<ApiResponse<CartItem[]>>({
    url: '/cart/list',
    method: 'get'
  })
}

// 添加商品到购物车
export function addToCart(productId: number, quantity: number) {
  return request<ApiResponse>({
    url: '/cart/add',
    method: 'post',
    data: { productId, quantity }
  })
}

// 更新购物车商品数量
export function updateCartItem(cartItemId: number, quantity: number) {
  return request<ApiResponse>({
    url: '/cart/update',
    method: 'put',
    data: { cartItemId, quantity }
  })
}

// 删除购物车商品
export function removeCartItem(cartItemId: number) {
  return request<ApiResponse>({
    url: '/cart/remove',
    method: 'delete',
    data: { cartItemId }
  })
}

// 清空购物车
export function clearCart() {
  return request<ApiResponse>({
    url: '/cart/clear',
    method: 'delete'
  })
}

// 购物车结算
export function checkoutCart() {
  return request<ApiResponse>({
    url: '/cart/checkout',
    method: 'post'
  })
} 