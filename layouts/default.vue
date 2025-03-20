<template>
  <div class="min-h-screen bg-gray-100">
    <Header />
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layout/Header.vue'
</script>