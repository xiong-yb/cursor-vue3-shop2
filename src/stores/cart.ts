import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<Array<{ product: Product; quantity: number }>>([])

  const count = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const addItem = (product: Product, quantity: number = 1) => {
    const existingItem = items.value.find(item => item.product.id === product.id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
  }

  const removeItem = (productId: number) => {
    const index = items.value.findIndex(item => item.product.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find(item => item.product.id === productId)
    if (item) {
      item.quantity = quantity
    }
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    count,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
}) 