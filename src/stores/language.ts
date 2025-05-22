import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Language } from '@/types'
import { setLang, initLang } from '@/utils/i18n'

export const useLanguageStore = defineStore('language', () => {
  const currentLang = ref<Language>('zh-CN')

  const setLanguage = (lang: Language) => {
    //console.log('Setting language to:', lang) // 添加调试日志
    currentLang.value = lang
    setLang(lang)
  }

  const initLanguage = () => {
    initLang()
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && (savedLang === 'zh-CN' || savedLang === 'en-US')) {
      currentLang.value = savedLang
    }
  }

  return {
    currentLang,
    setLanguage,
    initLanguage
  }
}) 