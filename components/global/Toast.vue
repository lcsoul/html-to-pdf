<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed bottom-4 right-4 flex items-center max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div
        class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
        :class="typeClass"
      >
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            v-if="type === 'success'"
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
          <path
            v-else-if="type === 'error'"
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.5 11.793-2.293 2.293a1 1 0 0 1-1.414-1.414L12.086 10.5 9.793 8.207a1 1 0 0 1 1.414-1.414l2.293 2.293 2.293-2.293a1 1 0 1 1 1.414 1.414L14.914 10.5l2.293 2.293a1 1 0 0 1-1.414 1.414L13.5 12.293Z"
          />
          <path
            v-else
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
          />
        </svg>
        <span class="sr-only">{{ type }} icon</span>
      </div>
      <div class="ml-3 text-sm font-normal">{{ message }}</div>
      <button
        type="button"
        class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label="Close"
        @click="hide"
      >
        <span class="sr-only">关闭</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  message: string
  show: boolean
  type?: 'success' | 'error' | 'info'
  timeout?: number
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const typeClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200'
    case 'error':
      return 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200'
    default:
      return 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200'
  }
})

// 自动关闭
watch(
  () => props.show,
  (newVal) => {
    if (newVal && props.timeout) {
      setTimeout(() => {
        hide()
      }, props.timeout)
    }
  }
)

const hide = () => {
  emit('update:show', false)
}
</script>