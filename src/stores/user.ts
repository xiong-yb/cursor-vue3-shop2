import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const username = ref('')
  const userAvatar = ref('')
  const token = ref('')

  const setUser = (user: { username: string; avatar: string; token: string }) => {
    isLoggedIn.value = true
    username.value = user.username
    userAvatar.value = user.avatar
    token.value = user.token
  }

  const clearUser = () => {
    isLoggedIn.value = false
    username.value = ''
    userAvatar.value = ''
    token.value = ''
  }

  return {
    isLoggedIn,
    username,
    userAvatar,
    token,
    setUser,
    clearUser
  }
}) 