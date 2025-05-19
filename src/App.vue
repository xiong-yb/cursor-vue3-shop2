<script setup lang="ts">
// App.vue 作为根组件，主要负责路由视图的渲染
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
