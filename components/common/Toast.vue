<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed z-50 top-0 right-0 mt-4 mr-4 max-w-sm w-full shadow-lg rounded-lg pointer-events-auto"
      :class="{
        'bg-green-50 border-green-400': type === 'success',
        'bg-red-50 border-red-400': type === 'error',
        'bg-blue-50 border-blue-400': type === 'info'
      }"
    >
      <div class="rounded-lg shadow-xs overflow-hidden">
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                v-if="type === 'success'"
                class="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <svg
                v-else-if="type === 'error'"
                class="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <svg
                v-else
                class="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p
                class="text-sm leading-5 font-medium"
                :class="{
                  'text-green-800': type === 'success',
                  'text-red-800': type === 'error',
                  'text-blue-800': type === 'info'
                }"
              >
                {{ message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="$emit('update:modelValue', false)"
                class="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
              >
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  timeout?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

let timer: NodeJS.Timeout | null = null;

const startTimer = () => {
  if (props.timeout && props.timeout > 0) {
    clearTimeout(timer as NodeJS.Timeout);
    timer = setTimeout(() => {
      emit('update:modelValue', false);
    }, props.timeout);
  }
};

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    startTimer();
  } else if (timer) {
    clearTimeout(timer);
  }
});

onMounted(() => {
  if (props.modelValue) {
    startTimer();
  }
});

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>