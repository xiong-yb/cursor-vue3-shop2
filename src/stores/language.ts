import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Language } from '@/types'

export const useLanguageStore = defineStore('language', () => {
  const currentLang = ref<Language>('zh-CN')

  const setLanguage = (lang: Language) => {
    currentLang.value = lang
  }

  return {
    currentLang,
    setLanguage
  }
}) 