<template>
  <el-dropdown @command="handleCommand">
    <span class="language-switch">
      {{ currentLang === 'zh-CN' ? '中文' : 'English' }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
        <el-dropdown-item command="en-US">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { ArrowDown } from '@element-plus/icons-vue'

const languageStore = useLanguageStore()
const currentLang = computed(() => languageStore.currentLang)

const handleCommand = (command: string) => {
  //console.log('Switching language to:', command) // 添加调试日志
  languageStore.setLanguage(command as 'zh-CN' | 'en-US')
}
</script>

<style scoped>
.language-switch {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--el-text-color-primary);
}
</style> 