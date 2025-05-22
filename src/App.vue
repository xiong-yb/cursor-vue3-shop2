<script setup lang="ts">
import { onMounted } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()

onMounted(() => {
  //console.log('Initializing language...') // 添加调试日志
  languageStore.initLanguage()
})
</script>

<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss">
@use "@/styles/variables.scss" as *;

.app {
  min-height: 100vh;
}
</style>
